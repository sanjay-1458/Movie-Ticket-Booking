import { Inngest } from "inngest";
import User from "../models/User.js";
import { prisma } from "../prisma/client.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database, we get data of user from clerk webhook

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + "" + last_name,
      image: image_url,
    };
    await User.create(userData);
  },
);

// Inngest function to delete a user from database

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  },
);

// Inngest function to update a user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + "" + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  },
);

// Inngest function to cancel booking and release seats of shows after 10 minutes, when payment is not done

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-release-bookings" }, 
  { event: "app/checkpayment" },
  async ({ event, step }) => {

    // 1. Wait for 10 minutes 
    await step.sleep("wait-for-2-minutes", "2m");

    await step.run("check-payment-status", async () => {
      // Fetch the booking from SQL
      const booking = await prisma.booking.findUnique({
        where: { id: event.data.bookingId },
      });

      if (booking && !booking.isPaid) {
        
        // A. Clear seats in MongoDB so other people can book them
        const show = await Show.findById(booking.showId);
        if (show && show.occupiedSeats) {
          booking.bookedSeats.forEach((seat) => {
            delete show.occupiedSeats[seat];
          });
          show.markModified("occupiedSeats");
          await show.save();
        }

        // B. Delete the booking from SQL (Prisma)
        await prisma.booking.delete({ 
          where: { id: booking.id } 
        });
      }
    });
  },
);

// Inngest function to send email when user books a show

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },

  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await step.run("fetch-booking-sql", async () => {
      return await prisma.booking.findUnique({
        where: { id: bookingId },
      });
    });

    if (!booking) {
      return { status: "Booking not found" };
    }

    const { user, show } = await step.run("fetch-mongo-details", async () => {
      const userData = await User.findById(booking.userId);
      const showData = await Show.findById(booking.showId).populate("movie");
      return { user: userData, show: showData };
    });
    if (!user || !show) {
      return { status: "User or Show data missing in MongoDB" };
    }

    await step.run("send-email", async () => {
      await sendEmail({
        to: user.email,
        subject: `Payment Confirmation: "${show.movie.title}" booked`,
        body: `
          <div style="font-family:Arial, sans-serif; line-height:1.5;">
            <h2>Hi ${user.name},</h2>
            <p>Your booking for <strong style="color: #F84565">
              "${show.movie.title}"
            </strong> is confirmed.</p>

            <p><strong>Date: </strong>${new Date(
              show.showDateTime,
            ).toLocaleDateString("en-US", {
              timeZone: "Asia/Kolkata",
            })}</p>

            <p><strong>Time: </strong>${new Date(
              show.showDateTime,
            ).toLocaleTimeString("en-US", {
              timeZone: "Asia/Kolkata",
            })}</p>
            
            <p>Enjoy the show!</p>
            <p>Thanks for booking with us!</p>
          </div>
        `,
      });
    });

    return { success: true, bookingId };
  },
);

// Ingest function to send reminders
const sendShowReminders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8 * * *" }, // Every 8 hours
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    // Reminder tasks

    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate("movie");

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;
        const userIds = [...new Set(Object.values(show.occupiedSeats))];

        if (userIds.length === 0) continue;
        const users = await User.find({
          _id: { $in: userIds },
        }).select("name email");

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });
    if (reminderTasks.length === 0) {
      return {
        sent: 0,
        message: "No reminders to send.",
      };
    }
    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: `

          <div style="font-family:Arial, sans-serif; line-height:1.5;">
      <h2>Hi ${task.user.name},
      </h2>
      <p>This is a quick reminder that your movie:</p>
       <h3 style="color: #F84565">
      "${task.show.movie.title}"
      </h3> 
      <p>
      is scheduled for <strong>${new Date(task.showTime).toLocaleDateString(
        "en-US",
        {
          timeZone: "Asia/Kolkata",
        },
      )}</strong> at

      <strong>${new Date(task.showTime).toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
      })}</strong>


      </p>
      

     
      <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!</p>
      <p>Enjoy the show!</p>
      </div>

          
          `,
          }),
        ),
      );
    });

    const sent = results.filter((r) => r.status === "fulfilled").length;

    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`,
    };
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
];

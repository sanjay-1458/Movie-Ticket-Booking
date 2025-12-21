import mongoose from "mongoose"; 
import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";

// Function to check availability of seats (Updated to accept session)
const checkSeatAvailability = async (showId, selectedSeats, session) => {
  const clash = await Show.findOne({
    _id: showId,
    $or: selectedSeats.map((seat) => ({
      [`occupiedSeats.${seat}`]: { $exists: true },
    })),
  }).session(session); // Bind to session

  return !clash;
};

// Creating booking data
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // 1. ATOMIC SECTION: Check & Reserve Seats
    const available = await checkSeatAvailability(showId, selectedSeats, session);
    
    if (!available) {
      await session.abortTransaction();
      session.endSession();
      return res.json({
        success: false,
        message: "Selected seats are not available",
      });
    }

    const showData = await Show.findById(showId).session(session).populate("movie");

    // Create booking (Using array syntax for transaction support)
    const [booking] = await Booking.create(
      [
        {
          user: userId,
          show: showId,
          amount: showData.showPrice * selectedSeats.length,
          bookedSeats: selectedSeats,
        },
      ],
      { session }
    );

    // Update seats atomically
    for (const seat of selectedSeats) {
      showData.occupiedSeats[seat] = userId;
    }

    showData.markModified("occupiedSeats");
    await showData.save({ session });

    // Commit the DB changes immediately to release locks
    await session.commitTransaction();
    session.endSession();

    // 2. EXTERNAL PROCESS: Stripe Payment (Outside transaction to avoid timeouts)
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(booking.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const stripeSession = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minute session
    });

    // Save the payment link to the booking (Standard save, no transaction needed now)
    booking.paymentLink = stripeSession.url;
    await booking.save();

    // Triggering Inngest scheduler
    await inngest.send({
      name: "app/checkpayment",
      data: {
        bookingId: booking._id.toString(),
      },
    });

    return res.json({ success: true, url: stripeSession.url });

  } catch (error) {
    // Abort transaction on any error
    if (session.inTransaction()) {
        await session.abortTransaction();
    }
    session.endSession();
    
    console.log("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("Error in fetching occupied seats", error.message);
    res.json({ success: false, message: error.message });
  }
};
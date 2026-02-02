import { prisma } from "../prisma/client.js";
import stripe from "stripe";
import { inngest } from "../inngest/index.js";

/**
 * CREATE BOOKING
 * - Uses PostgreSQL (Prisma) for booking + seat locking
 * - Uses Stripe for payment
 * - Uses Inngest for async follow-up
 */
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();

    // 🔴 THIS IS CRITICAL
    const { showId, selectedSeats, showPrice, movieTitle } = req.body;

    // 🔴 HARD GUARD (prevents silent undefined)
    if (!showId || !selectedSeats || !showPrice) {
      return res.status(400).json({
        success: false,
        message: "showId, selectedSeats, showPrice are required",
      });
    }

    // ✅ amount MUST be computed HERE
    const amount = Number(showPrice) * selectedSeats.length;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount calculation",
      });
    }

    // ✅ THIS is what Prisma actually receives
    const booking = await prisma.booking.create({
      data: {
        userId,
        showId,
        amount, // ✅ THIS WAS MISSING AT RUNTIME
        seats: {
          create: selectedSeats.map((seat) => ({
            showId,
            seatNo: seat,
          })),
        },
      },
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const stripeSession = await stripeInstance.checkout.sessions.create({
      success_url: `${req.headers.origin}/loading/my-bookings`,
      cancel_url: `${req.headers.origin}/my-bookings`,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: movieTitle,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentLink: stripeSession.url },
    });

    await inngest.send({
      name: "app/checkpayment",
      data: { bookingId: booking.id },
    });

    return res.json({ success: true, url: stripeSession.url });
  } catch (error) {
    console.error("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};

/**
 * GET OCCUPIED SEATS
 * - Reads from PostgreSQL (bookingSeat table)
 */
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const seats = await prisma.bookingSeat.findMany({
      where: { showId },
      select: { seatNo: true },
    });

    return res.json({
      success: true,
      occupiedSeats: seats.map((s) => s.seatNo),
    });
  } catch (error) {
    console.error("Error in fetching occupied seats:", error);
    return res.json({ success: false, message: error.message });
  }
};

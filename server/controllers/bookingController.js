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
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // 1. Fetch Show details from MongoDB (to get the real price and title)
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }

    const amount = showData.showPrice * selectedSeats.length;

    // 2. PRISMA ATOMIC TRANSACTION
    // This creates the booking AND the seats. 
    // If ANY seat is already taken, PostgreSQL will fail, and NO booking will be created.
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        showId: showId,
        amount: amount,
        seats: {
          create: selectedSeats.map((seat) => ({
            showId: showId,
            seatNo: seat,
          })),
        },
      },
    });

    // 3. STRIPE PAYMENT SETUP
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const stripeSession = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: showData.movie.title },
            unit_amount: amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id }, // Use SQL 'id' (UUID)
    });

    // 4. UPDATE BOOKING WITH PAYMENT LINK
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentLink: stripeSession.url },
    });

    // 5. TRIGGER INNGEST (Pass the SQL UUID)
    await inngest.send({
      name: "app/checkpayment",
      data: { bookingId: booking.id },
    });

    return res.json({ success: true, url: stripeSession.url });

  } catch (error) {
    // 6. CATCH DOUBLE-BOOKING ERROR (Prisma P2002 Unique Constraint)
    if (error.code === 'P2002') {
      return res.json({ 
        success: false, 
        message: "One or more seats are already taken. Please refresh and try again." 
      });
    }

    console.error("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const seats = await prisma.bookingSeat.findMany({
      where: { showId },
      select: { seatNo: true },
    });

    res.json({
      success: true,
      occupiedSeats: seats.map((s) => s.seatNo),
    });
  } catch (error) {
    console.error("Error fetching occupied seats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Could not retrieve seat data" 
    });
  }
};
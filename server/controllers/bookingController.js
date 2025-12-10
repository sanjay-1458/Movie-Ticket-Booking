import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";

// Function to check availabilty of seats
const checkSeatAvailability = async (showId, selectedSeats) => {
  const clash = await Show.findOne({
    _id: showId,
    $or: selectedSeats.map((seat) => ({
      [`occupiedSeats.${seat}`]: { $exists: true },
    })),
  });

  return !clash;
};

// Creating booking data

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    const available = await checkSeatAvailability(showId, selectedSeats);
    if (!available) {
      return res.json({
        success: false,
        message: "Selected seats are not vailable",
      });
    }

    const showData = await Show.findById(showId).populate("movie");

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Update seats atomically
    for (const seat of selectedSeats) {
      showData.occupiedSeats[seat] = userId;
    }

    showData.markModified("occupiedSeats");
    await showData.save();

    // Stripe payment

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Line items for stripe

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

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minute seesion
    });

    booking.paymentLink = session.url;
    await booking.save();

    // Triggering Inngest scheduler

    await inngest.send({
      name: "app/checkpayment",
      data: {
        bookingId: booking._id.toString(),
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
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

import { inngest } from "../inngest/index.js";
import stripe from "stripe";
import { prisma } from "../prisma/client.js";
import Show from "../models/Show.js";

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // 1. Fetch Show details from MongoDB
    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }

    const amount = showData.showPrice * selectedSeats.length;

    // 2. PRISMA ATOMIC TRANSACTION

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          userId: userId,
          showId: showId,
          amount: amount,
          bookedSeats: selectedSeats,
          isPaid: false,
        },
      });

      await tx.bookingSeat.createMany({
        data: selectedSeats.map((seat) => ({
          bookingId: newBooking.id,
          showId: showId,
          seatNo: seat,
        })),
      });

      return newBooking;
    });

    await inngest.send({
      name: "app/checkpayment",
      data: { bookingId: booking.id },
    });
    // 3. STRIPE SETUP
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
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id },
    });

    // 4. UPDATE WITH PAYMENT LINK
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentLink: stripeSession.url },
    });

    return res.json({ success: true, url: stripeSession.url });
  } catch (error) {
    console.error("Booking error:", error);
    if (error.code === "P2002") {
      return res.json({
        success: false,
        message:
          "One or more selected seats are already booked. Please refresh.",
      });
    }

    return res.json({ success: false, message: error.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    // Fetch all seats occupied to this show from SQL
    const seats = await prisma.bookingSeat.findMany({
      where: { showId },
      select: { seatNo: true },
    });

    res.json({
      success: true,
      occupiedSeats: seats.map((s) => s.seatNo),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import stripe from "stripe";
import { prisma } from "../prisma/client.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  // 1. CRITICAL: Verify the signature
  // If this fails, it means the request didn't come from Stripe.
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Process the Event
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { bookingId } = session.metadata;
      console.log("Found Booking ID in Metadata:", bookingId);
      console.log(`Payment received for Booking: ${bookingId}`);

      // 3. Update PostgreSQL via Prisma
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          isPaid: true,
          paymentLink: null,
        },
      });

      // 4. Trigger Inngest
      await inngest.send({
        name: "app/show.booked",
        data: { bookingId: updatedBooking.id },
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};

import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  console.log("inside webhook1")
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("inside webhook2")
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    console.log("inside webhook3")
    switch (event.type) {
      case "checkout.session.completed": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { bookingId } = session.metadata;
        console.log("inside webhook4", bookingId)
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });
        console.log("paid")
        break;
      }

      default:
        console.log("Unhandled Event Type", event.type);
    }
    res.json({
      received: true,
    });
  } catch (error) {
    console.log("Webhook processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};

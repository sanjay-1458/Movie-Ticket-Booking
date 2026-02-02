import stripe from "stripe";
import { prisma } from "../prisma/client.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (request, response) => {
  console.log("STRIPE WEBHOOK HIT");

  console.log("Headers keys:", Object.keys(request.headers));
  console.log(
    "Body type:",
    typeof request.body,
    "isBuffer:",
    Buffer.isBuffer(request.body),
    "length:",
    request.body?.length,
  );

  const sig = request.headers["stripe-signature"];
  console.log("Stripe signature present:", !!sig);

  if (!request.body || !request.body.length) {
    console.error("BODY IS EMPTY — Stripe cannot verify");
    return response.status(400).send("Empty body");
  }

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Event verified:", event.type);
  } catch (error) {
    console.error("Signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    console.log("Event data object keys:", Object.keys(event.data.object));

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Session metadata:", session.metadata);

      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.error("bookingId missing in metadata");
        return response.status(400).send("Missing bookingId");
      }

      console.log("Booking ID:", bookingId);

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          isPaid: true,
          paymentLink: null,
        },
      });

      console.log("Booking marked as PAID in DB");

      await inngest.send({
        name: "app/show.booked",
        data: { bookingId },
      });

      console.log("📨 Inngest event sent");
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    response.status(500).send("Internal Server Error");
  }
};

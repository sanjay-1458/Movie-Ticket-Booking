## Stripe

Stripe is a payment processing platform that allows applications to accept and manage online payments securely.
Stripe handles all sensitive financial operations so our application does not need to deal with raw card data. It create a secure payment session, process the charge, and notify your backend about the payment result.

## Svix

Svix is used for sending webhook when the service uses Clerk, as stripe has its own webhook-verification sysytem

## Working

In this application we have:<br>
Stripe for payments.<br>
Clerk for authentication.<br>

We need this environment variable first from stripe developer option.

```js
STRIPE_PUBLISHABLE_KEY = KEY;
STRIPE_SECRET_KEY = KEY;
STRIPE_WEBHOOK_SECRET = SECRET;
```

When creating booking we need stripe client instance using our secret key:<br>
`const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)`. It tells that we are now authorized to create PaymentIntents, Checkout Sessions, refunds, etc.

To describe what customer is paying for we create `lime_items` which has line_items[0] =

```js
{
  price_data: {
    currency: "usd",
    product_data: {
    name: showData.movie.title,
    },
    unit_amount: Math.floor(Booking.amount) * 100,
  },
quantity: 1,
}
```

Now, we are creating a seesion which creates a Stripe Checkout Session, which is the hosted payment page.

```js
const session = await stripeInstance.checkout.sessions.create({
  success_url: `${origin}/loading/my-bookings`,
  cancel_url: `${origin}/my-bookings`,
  line_items: line_items,
  mode: "payment",
  metadata: {
    bookingId: booking._id.toString(),
  },
  expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
});
```

The `booking` database has a payment link which is basically th URL returned by Stripe which is used it frontend for payment.
`booking.paymentLink = session.url`.

Now when user book a show they are redirected to stripe payment gateway, and after filling they are redirected to loading for 8 second to show that payement is in progress, after that they are redirected to `My Bookings`. 

Here, we will need to marked the paid shows. To do that we need webhook which we can setup from Stripe developer option by attaching the URL of our backend service.
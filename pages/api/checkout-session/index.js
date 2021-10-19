import stripe from "lib/stripe";

const sessions = async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: {
      trial_period_days: 30,
    },
    // automatic_tax: { enabled: true },
    success_url: `http://localhost:3000/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/?canceled=true`,
  });

  res.status(200).json({ sessionId: session.id });
};

export default sessions;

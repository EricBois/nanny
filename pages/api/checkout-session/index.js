import stripe from "utils/stripe/stripe";

const sessions = async (req, res) => {
  const DOMAIN = req.headers.origin;

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
    success_url: `${DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}/?canceled=true`,
  });

  res.status(200).json({ sessionId: session.id });
};

export default sessions;

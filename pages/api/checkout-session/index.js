import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const sessions = async (req, res) => {
  const { quantity } = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRICE_ID,
        quantity,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/checkout`,
  });
  res.status(200).json({ sessionId: session.id });
};

export default sessions;

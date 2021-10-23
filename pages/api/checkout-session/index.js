import { connectToDatabase } from "lib/db";
import { getSession } from "next-auth/client";
import stripe from "utils/stripe/stripe";

const sessions = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const authSession = await getSession({ req });

  if (!authSession) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const DOMAIN = req.headers.origin;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne(
    {
      email: authSession.user.email,
    },
    { projection: { password: 0 } }
  );

  const newCustomer = await stripe.customers.create({
    email: user.email,
    description: "New Customer",
  });

  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });

  const stripeSession = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    customer: newCustomer.id,
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
    success_url: `${DOMAIN}/profile`,
    cancel_url: `${DOMAIN}/?canceled=true`,
  });

  const result = usersCollection.updateOne(
    { email: authSession.user.email },
    { $set: { customerId: stripeSession.customer } }
  );

  client.close();

  res.status(200).json({ sessionId: stripeSession.id });
};

export default sessions;

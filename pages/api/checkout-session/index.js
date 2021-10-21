import { connectToDatabase } from "lib/db";
import { getSession } from "next-auth/client";
import stripe from "utils/stripe/stripe";

const sessions = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const DOMAIN = req.headers.origin;
  const authSession = await getSession({ req });

  if (!authSession) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const client = await connectToDatabase();
  const usersCollection = client.db().collection("users");

  const currentUser = await usersCollection.findOne(
    {
      email: authSession.user.email,
    },
    { projection: { password: 0 } }
  );

  //todo: create stripe customer

  const newCustomer = await stripe.customers.create({
    email: currentUser.email,
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
    success_url: `${DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}/?canceled=true`,
  });

  // console.log(currentUser);
  // console.log(newCustomer);
  // console.log(req);
  // console.log(authSession);
  // console.log(stripeSession);

  const result = usersCollection.updateOne(
    { email: authSession.user.email },
    { $set: { customerId: stripeSession.customer } }
  );

  res.status(200).json({ sessionId: stripeSession.id });
};

export default sessions;

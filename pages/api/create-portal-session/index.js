import { connectToDatabase } from "lib/db";
import { getSession } from "next-auth/client";
import { stripe } from "utils/stripe";

const createPortalSession = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const authSession = await getSession({ req });

  if (!authSession) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const returnUrl = req.headers.origin;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({
    email: authSession.user.email,
  });

  if (!user.customerId) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: returnUrl,
  });

  client.close();

  return res.status(200).json({ portalUrl: portalSession.url });
};

export default createPortalSession;

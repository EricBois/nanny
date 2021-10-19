import stripe from "lib/stripe";

const createPortalSession = async (req, res) => {
  const returnUrl = "https://localhost:3000";
  const { session_id } = req.body;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
};

export default createPortalSession;

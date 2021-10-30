import { manageSubscriptionStatusChange, stripe } from "utils/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (readable) => {
  const chunks = [];

  for await (const chunk of readable) {
    chunk.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
]);

const webhookHandler = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    let subscription;
    let status;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.trial_will_end":
            subscription = event.data.object;
            status = subscription.status;

            //todo: finish manageSubscriptionChange to handle notifications
            await manageSubscriptionStatusChange(event.id);
        }
      } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
      }
    }
  }
};

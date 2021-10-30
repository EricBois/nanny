import pusherInstance from "lib/pusher";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const authSession = await getSession({ req });

  if (!authSession) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const { message, to, sender } = req.body;

  await pusherInstance.trigger(`presence-my-channel-${to}`, "chat-event", {
    message,
    sender,
  });
  res.send({ message, sender });
};

export default handler;

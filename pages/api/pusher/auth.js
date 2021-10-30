import pusherInstance from "lib/pusher";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const authSession = await getSession();

  if (!authSession) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const { socket_id, channel_name, userEmail, username } = req.body;

  const presenceData = {
    user_id: userEmail,
    user_info: {
      username: "@" + username,
      userEmail,
    },
  };

  const auth = pusherInstance.authenticate(
    socket_id,
    channel_name,
    presenceData
  );

  res.send(auth);
};

export default handler;

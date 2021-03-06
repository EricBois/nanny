import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  let result;
  switch (`${req.method}`) {
    case "GET":
      result = user;
      break;
    case "POST":
      // handlePost()
      break;
    case "PATCH":
      result = await usersCollection.updateOne(
        { email: userEmail },
        { $set: req.body }
      );
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }

  client.close();
  res.status(200).json({
    email: result.email,
    photo: result.photo,
    name: result.name,
    documents: result.documents,
    phone: result.phone,
    location: result.location,
    profileType: result.profileType,
    completed: result.completed,
  });
}

export default handler;

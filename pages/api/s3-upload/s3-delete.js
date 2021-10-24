import { getSession } from "next-auth/client";
import { connectToDatabase } from "lib/db";
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  accessKeyId: process.env.S3_UPLOAD_KEY,
  region: "us-east-1", // region of your bucket
});

const s3 = new aws.S3();

export default async function Delete(req, res) {
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

  const url = req.body.document.split("/");
  const myKey = `${url[4]}/${url[5]}`;
  const params = {
    Bucket: "nannyapp",
    Delete: {
      // required
      Objects: [
        // required
        {
          Key: `next-s3-uploads/${myKey}`, // required
        },
      ],
    },
  };
  await s3.deleteObjects(params, (err) => {
    if (err) throw new Error(err, err.stack); // an error occurred
  });
  // TODO delete from profile db
  try {
    if (req.body.file === "photo") {
      await usersCollection.updateOne(
        { email: userEmail },
        { $unset: { photo: "" } }
      );
    } else {
      await usersCollection.updateOne(
        { email: userEmail },
        { $pull: { documents: req.body.document } }
      );
    }
  } catch (err) {
    throw new Error(err.message);
  }
  await res.status(200).json({ status: "ok" });
}

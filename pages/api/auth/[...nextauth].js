import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();
        return {
          uid: user.id,
          email: user.email,
          name: user.name,
          documents: user.documents,
          address: user.address,
          city: user.city,
          country: user.country,
          phone: user.phone,
          postal: user.postal,
          province: user.province,
        };
      },
    }),
  ],
});

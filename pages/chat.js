import ChatContent from "components/chat-content";
import { getSession } from "next-auth/client";

export default function Chat({ session }) {
  return <ChatContent />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

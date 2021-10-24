import CheckoutPageContent from "components/checkout-page";
import { getSession } from "next-auth/client";

export default function CheckoutPage({ session }) {
  return <CheckoutPageContent />;
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

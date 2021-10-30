import { useProfile } from "lib/profile";
import { getSession } from "next-auth/client";
import { useState, useEffect } from "react";
import Nanny from "../components/dashboard/Nanny";
import Family from "components/dashboard/Family";
import UserProfile from "components/profile/user-profile";

export default function Dashboard() {
  const { profile } = useProfile();
  const [status, setStatus] = useState("done");

  // initial setting of profile
  useEffect(() => {
    if (profile) {
      if (!profile.completed) {
        setStatus("form");
      } else {
        setStatus("done");
      }
    }
  }, [profile]);

  switch (status) {
    case "done":
      let component;
      profile.profileType === "nanny"
        ? (component = <Nanny />)
        : (component = <Family />);
      return component;
    case "form":
      return <UserProfile status={status} />;
  }
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

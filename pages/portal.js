import { getSession } from "next-auth/client";
import { useProfile } from "lib/profile";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Portal() {
  const router = useRouter();
  const { profile, getProfile, updateProfile, loading, show, setShow } =
    useProfile();

  useEffect(() => {
    if (profile.profileType === "nanny" || profile.profileType === "family") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginTop: "30vh",
        }}
      >
        <span>Are you a</span>
        <button
          type="button"
          style={{ border: "1px solid black", margin: "0 5px 0 5px" }}
        >
          Nanny
        </button>
        <span>Or</span>
        <button
          type="button"
          style={{ border: "1px solid black", margin: "0 5px 0 5px" }}
        >
          Family
        </button>
      </div>
    </div>
  );
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

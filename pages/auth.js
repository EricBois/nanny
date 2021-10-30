import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import { useProfile } from "lib/profile";

import AuthForm from "components/auth/auth-form";

function AuthPage() {
  const { getProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function myProfile() {
    await getProfile();
    router.replace("/portal");
  }

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        myProfile();
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <AuthForm />;
}

export default AuthPage;

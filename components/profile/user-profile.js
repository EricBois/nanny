import NannyForm from "./forms/nanny-form";
import FamilyForm from "./forms/family-form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useProfile } from "lib/profile";

function UserProfile() {
  const { profile } = useProfile();
  const { profileType } = profile;
  if (!profile) return <p>Loading ...</p>;
  return (
    <section>
      <h1 className="text-center text-4xl">Your Profile</h1>
      {profileType === "nanny" ? <NannyForm /> : <FamilyForm />}
    </section>
  );
}

export default UserProfile;

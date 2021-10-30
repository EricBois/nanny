import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/client";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function ProfileProvider({ children }) {
  const [session] = useSession();
  const [profile, setProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function updateProfile(info) {
    if (session) {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      getProfile();
    } else {
      setProfile({});
    }
  }

  async function getProfile() {
    if (session) {
      setLoading(true);
      const response = await fetch("/api/user/profile", {
        method: "GET",
      });
      const data = await response.json();
      setProfile(data);
      setLoading(false);
      if (data?.location?.value) {
        await setShow(false);
      } else if (data?.location?.value !== "undefined") {
        await setShow(true);
      }
      return profile;
    } else {
      setProfile({});
    }
  }

  useEffect(() => {
    getProfile();
  }, [session && profile.length < 1]);

  return (
    <LocalStateProvider
      value={{ profile, getProfile, updateProfile, loading, show, setShow }}
    >
      {children}
    </LocalStateProvider>
  );
}

// custom hook to access profile local state
function useProfile() {
  const all = useContext(LocalStateContext);
  return all;
}
export { ProfileProvider, useProfile };

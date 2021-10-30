import { useSession } from "next-auth/client";
import Pusher from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function ProfileProvider({ children }) {
  const [session] = useSession();
  const [profile, setProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [chats, setChats] = useState([]);

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

  function subscribeToChannel() {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: {
          userEmail: session.user.email,
          username: session.user.name,
        },
      },
    });

    const channel = pusher.subscribe(
      `presence-my-channel-${session.user.email}`
    );

    channel.bind("chat-event", (data) => {
      setChats((prevState) => [
        ...prevState,
        { sender: data.sender, message: data.message },
      ]);
    });

    return pusher;
  }

  useEffect(() => {
    getProfile();
  }, [session && profile.length < 1]);

  useEffect(() => {
    let channelSubscription;
    if (session) {
      channelSubscription = subscribeToChannel();
    }

    return async () => {
      channelSubscription.unsubscribe(
        `private-my-channel-${session.user.email}`
      );
    };
  }, []);

  return (
    <LocalStateProvider
      value={{
        profile,
        getProfile,
        updateProfile,
        loading,
        show,
        setShow,
        chats,
      }}
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

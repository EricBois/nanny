import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { fetchPostJSON } from "utils/api-helpers";

export default function ChatContent({ sender, appKey }) {
  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      //* Do we need this to be encrypted
      // encrypted: true,
    });
    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", function (data) {
      setChats((prevState) => [
        ...prevState,
        { sender: data.sender, message: data.message },
      ]);

      return () => {
        pusher.unsubscribe("chat");
      };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchPostJSON("/api/pusher", { message: messageToSend, sender });
  };

  return (
    <>
      <p>Hello, {sender}</p>
      <div>
        {chats.map((chat, id) => (
          <>
            <p>{chat.message}</p>
            <small>{chat.sender}</small>
          </>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="start typing...."
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

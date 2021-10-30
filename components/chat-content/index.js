import { useFormik } from "formik";
import { useProfile } from "lib/profile";
import { useSession } from "next-auth/client";
import { fetchPostJSON } from "utils/api-helpers";

export default function ChatContent() {
  const { chats } = useProfile();

  const [session] = useSession();
  const sender = session.user.name;

  const formik = useFormik({
    initialValues: {
      to: "",
      message: "",
    },
    onSubmit: async ({ message, to }, { resetForm }) => {
      await fetchPostJSON("api/pusher/message", { message, sender, to });
    },
  });

  return (
    <>
      <p>Hello, {sender}</p>
      <div>
        {chats.map((chat, id) => (
          <div key={id}>
            <p>{chat.message}</p>
            <small>{chat.sender}</small>
          </div>
        ))}
      </div>

      <form onSubmit={formik.handleSubmit} method="POST">
        <input
          id="message"
          type="text"
          value={formik.values.message}
          onChange={formik.handleChange}
          placeholder="start typing...."
        />
        <input
          id="to"
          type="text"
          value={formik.values.to}
          onChange={formik.handleChange}
          placeholder="Who this message for"
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

import { Provider } from "next-auth/client";
import { ProfileProvider } from "lib/profile";
import "tailwindcss/tailwind.css";

import Layout from "components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ProfileProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProfileProvider>
    </Provider>
  );
}

export default MyApp;

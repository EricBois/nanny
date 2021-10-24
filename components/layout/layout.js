import { Fragment } from "react";
import Script from "next/script";

import MainNavigation from "./main-navigation";

function Layout(props) {
  return (
    <Fragment>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDFnvaCrcSie-lMayV9tccH0VJpJyZ0yZA&libraries=places`}
        strategy="beforeInteractive"
      />
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;

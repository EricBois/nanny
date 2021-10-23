import { useState } from "react";
import { fetchPostJSON } from "utils/api-helpers";
import getStripe from "utils/stripe/get-stripejs";
import classes from "./checkout-page.module.css";

export default function CheckoutPageContent() {
  const [loading, setLoading] = useState(false);

  //todo: testing -> move this to profile page once fixed, add error handling
  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const response = await fetchPostJSON("api/create-portal-session", {});
    console.log(response);
    window.location.assign(response.portalUrl);
    setLoading(false);
  };

  const onClickHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetchPostJSON("api/checkout-session", {
      quantity: 1,
    });

    if (response.status === 500) {
      console.error(response.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });

    console.warn(error.message);
    setLoading(false);
  };

  return (
    <div className={classes.checkout}>
      {loading ? (
        <div>...loading</div>
      ) : (
        <>
          <div className={classes.product}>
            <div className={classes.description}>
              <h3>Test Product</h3>
              <h5>$22.99 / month</h5>
              <ul>
                <li>Feature one</li>
                <li>Feature two</li>
                <li>Feature three</li>
              </ul>
            </div>
            <button
              disabled={loading}
              className={classes.btn}
              role="link"
              onClick={onClickHandler}
            >
              Choose Plan &rarr;
            </button>
          </div>
          <div>
            <button onClick={redirectToCustomerPortal}>
              Manage your billing
            </button>
          </div>
        </>
      )}
    </div>
  );
}

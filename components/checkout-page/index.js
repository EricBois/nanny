import getStripe from "lib/get-stripejs";
import classes from "./checkout-page.module.css";

export default function CheckoutPageContent() {
  const onClickHandler = async (e) => {
    e.preventDefault();

    const { sessionId } = await fetch("api/checkout-session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    }).then((res) => res.json());

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div className={classes.checkout}>
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
        <button className={classes.btn} role="link" onClick={onClickHandler}>
          Choose Plan &rarr;
        </button>
      </div>
    </div>
  );
}

import getStripe from "lib/get-stripejs";

export default function CheckoutPage() {
  const onClickHandler = async (event) => {
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
    <div>
      <button role="link" onClick={onClickHandler}>
        checkout
      </button>
    </div>
  );
}

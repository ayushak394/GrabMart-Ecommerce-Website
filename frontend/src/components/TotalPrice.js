import React from "react";
import "../CSS/TotalPrice.css";
import useTokenCheck from "../hooks/tokencheck";

const TotalPrice = ({ cartItems, totalPrice }) => {
  useTokenCheck();

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById("cashfree-script");

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js";
        script.id = "cashfree-script";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      } else {
        resolve(true);
      }
    });
  };

  const handleCheckout = async () => {
    const scriptLoaded = await loadCashfreeScript();
    if (!scriptLoaded) {
      alert("Cashfree SDK failed to load.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          name: "Test User",
          email: "test@example.com",
          phone: "9999999999",
        }),
      });

      const data = await response.json();

      if (data?.payment_session_id && window.Cashfree) {
        const cf = new window.Cashfree(data.payment_session_id);
        cf.redirect();
      } else {
        console.error("Invalid payment session response:", data);
        alert("Payment initiation failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while initiating payment.");
    }
  };

  return (
    <div className="total-price">
      <h1>Total Price:</h1>
      <div className="price-details">
        {cartItems.map((item) => (
          <p key={item.productId._id}>
            <img className="image" src={item.productId.image} alt={item.productId.name} />
            {item.productId.name} - {item.productId.price} x {item.quantity}
          </p>
        ))}
      </div>
      <div className="price-value">₹{totalPrice}</div>
      <button className="button" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default TotalPrice;

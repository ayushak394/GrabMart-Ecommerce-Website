import React from "react";
import "../CSS/TotalPrice.css";
import useTokenCheck from "../hooks/tokencheck";

const TotalPrice = ({ cartItems, totalPrice }) => {
  useTokenCheck();

  const baseURL = process.env.REACT_APP_API_URL;

  const numericTotalPrice = parseFloat(totalPrice) || 0;
  const taxRate = 0.20;
  const taxAmount = numericTotalPrice * taxRate;
  const finalTotalWithTax = numericTotalPrice + taxAmount;

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
      const response = await fetch(`${baseURL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotalWithTax.toFixed(2),
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
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
            {item.productId.name} - ${(parseFloat(item.productId.price) || 0).toFixed(2)} x {item.quantity}
          </p>
        ))}
      </div>
      <div className="price-summary">
        {/* MODIFIED HTML STRUCTURE HERE */}
        <p>
          <span>Subtotal:</span>
          <span>${numericTotalPrice.toFixed(2)}</span>
        </p>
        <p>
          <span>Tax (20%):</span>
          <span>${taxAmount.toFixed(2)}</span>
        </p>
        <div className="final-total">
          {/* MODIFIED HTML STRUCTURE HERE */}
          <p>
            <span>Final Total:</span>
            <span>${finalTotalWithTax.toFixed(2)}</span>
          </p>
        </div>
      </div>
      <button className="button" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default TotalPrice;
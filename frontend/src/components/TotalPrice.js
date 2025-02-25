import React from "react";
import "../CSS/TotalPrice.css";
import useTokenCheck from "../hooks/tokencheck";
const TotalPrice = ({ cartItems, totalPrice }) => {
  useTokenCheck();
  return (
    <div className="total-price">
      <h1>Total Price:</h1>
      <div className="price-details">
        {cartItems.map((item) => {
          return (
            <p key={item.productId._id}>
              <img
                className="image"
                src={item.productId.image}
                alt={item.productId.name}
              />
              {item.productId.name} - {item.productId.price} x {item.quantity}
            </p>
          );
        })}
      </div>
      <div className="price-value">${totalPrice}</div>
      <button className="button"> Proceed to Checkout</button>
    </div>
  );
};

export default TotalPrice;

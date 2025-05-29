import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/Carts.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TotalPrice from "./TotalPrice";
import useTokenCheck from "../hooks/tokencheck";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const Cart = ({ totalItems, refreshCart }) => {
  useTokenCheck();
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = getUserIdFromToken();

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${baseURL}/cart/${userId}`)
      .then((response) => setCartItems(response.data))
      .catch((error) => console.error("Error fetching cart", error));
  }, [userId]);

  const handleremoveItem = (productId) => {
    if (!userId) return;

    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.productId._id !== productId)
    );

    console.log("Removing item:", userId, productId);

    axios
      .delete(`${baseURL}/cart/remove/${userId}/${productId}`)
      .then(() => {
        console.log("Item removed successfully");
        refreshCart();
      })
      .catch((error) => console.error("Error removing item", error));
  };

  const handleDecreaseQuantity = (productId) => {
    if (!userId) return;

    setCartItems((prevCartItems) => {
      return prevCartItems.map((item) => {
        if (item.productId._id === productId && item.quantity > 1) {
          const updatedQuantity = item.quantity - 1;
          axios
            .put(`${baseURL}/cart/update/${userId}/${productId}`, {
              quantity: updatedQuantity,
            })
            .then(() => {
              console.log("Quantity updated successfully");
              refreshCart();
            })
            .catch((error) => console.error("Error updating quantity", error));
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
    });
  };

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.productId.price * item.quantity, 0)
    .toFixed(2);

  const searchAndAllProducts = cartItems.filter((item) =>
    item.productId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="CartPage">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalItems={totalItems}
      />
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="cart-items">
          {searchAndAllProducts.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                width="50"
              />
              <p>
                {item.productId.name} - ₹{item.productId.price} x{" "}
                {item.quantity}
              </p>
              <button
                onClick={() => handleremoveItem(item.productId._id)}
                className="remove-button"
              >
                Remove Item
              </button>
              <button
                onClick={() => handleDecreaseQuantity(item.productId._id)}
                className="decrease-button"
                disabled={item.quantity <= 1}
              >
                Decrease Quantity
              </button>
            </div>
          ))}
        </div>
      )}
      <TotalPrice cartItems={cartItems} totalPrice={totalPrice} />
      <Footer />
    </div>
  );
};

export default Cart;

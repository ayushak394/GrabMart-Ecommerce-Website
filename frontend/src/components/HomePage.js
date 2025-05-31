import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ProductList from "./Products";
import Sidebar from "./Sidebar";
import useTokenCheck from "../hooks/tokencheck";
import "../CSS/HomePage.css";
import { jwtDecode } from "jwt-decode";
import emailjs from "@emailjs/browser";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const Homepage = ({ totalItems, refreshCart }) => {
  useTokenCheck();

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

  const userId = getUserIdFromToken();

  const [sortCriteria, setSortCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showThankYouMsg, setShowThankYouMsg] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${baseURL}/cart/${userId}`)
      .then((response) => setCartItems(response.data))
      .catch((error) => console.error("Error fetching cart", error));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getUsername/${userId}`
        );
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getEmail/${userId}`
        );
        setUserEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching email: ", error);
      }
    };

    fetchUsername();
    fetchEmail();
  }, [userId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("paymentSuccess") === "true" &&
      userEmail &&
      userName &&
      cartItems.length > 0
    ) {
      setPaymentSuccess(true);
      setShowThankYouMsg(true);
      sendConfirmationEmail();
      setCartItems([]);

      params.delete("paymentSuccess");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);

      const timer = setTimeout(() => {
        setShowThankYouMsg(false);
        setPaymentSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [userEmail, userName, cartItems]);

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.productId.price * item.quantity, 0)
    .toFixed(2);

  const numericTotalPrice = parseFloat(totalPrice) || 0;
  const taxRate = 0.18;
  const taxAmount = numericTotalPrice * taxRate;
  const finalTotalWithTax = numericTotalPrice + taxAmount;

  const sendConfirmationEmail = () => {
    const productListHTML = cartItems
      .map((item) => {
        const name = item.productId.name;
        const quantity = item.quantity;
        const price = (item.productId.price * item.quantity).toFixed(2);
        return `<tr><td>${name}</td><td>${quantity}</td><td>$${price}</td></tr>`;
      })
      .join("");

    const templateParams = {
      user_name: userName,
      user_email: userEmail,
      subtotal: totalPrice,
      taxes: taxAmount,
      total_amount: finalTotalWithTax,
      year: new Date().getFullYear(),
      product_list: productListHTML,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then((response) => {
        console.log("Email sent successfully", response);
      })
      .catch((error) => {
        console.error("Email sending error:", error);
      });
  };

  return (
    <>
      <div className="HomePage">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalItems={totalItems}
        />
        <Sidebar setSortCriteria={setSortCriteria} />
        <ProductList
          sortCriteria={sortCriteria}
          searchQuery={searchQuery}
          refreshCart={refreshCart}
        />
        {showThankYouMsg && (
          <div className="thank-you-msg">
            <p>Thank You for Your Purchase! 🎉</p>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;

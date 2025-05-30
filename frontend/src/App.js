import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import Cart from "./components/Carts";
import Profile from "./components/Profile";
import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const userId = getUserIdFromToken();
  const baseURL = process.env.REACT_APP_API_URL;

  const refreshCart = useCallback(() => {
    if (!userId) return;
    axios
      .get(`${baseURL}/cart/${userId}`)
      .then((response) => {
        const cartData = response.data;
        setCartItems(cartData);
        const total = cartData.reduce((acc, item) => acc + item.quantity, 0);
        setTotalItems(total);
      })
      .catch((error) => console.error("Error fetching cart", error));
  }, [userId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route
          path="/Home"
          element={
            <HomePage totalItems={totalItems} refreshCart={refreshCart} />
          }
        />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/Cart"
          element={<Cart totalItems={totalItems} refreshCart={refreshCart} />}
        />
        <Route path="/Profile" element={<Profile totalItems={totalItems} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

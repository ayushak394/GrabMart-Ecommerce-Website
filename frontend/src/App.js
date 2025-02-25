import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import Cart from "./components/Carts";
import Profile from "./components/Profile";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:4000/cart/${userId}`)
      .then((response) => {
        setCartItems(response.data);
        const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setTotalItems(total);
      })
      .catch((error) => console.error("Error fetching cart", error));
  }, [userId, cartItems]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage totalItems={totalItems} />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Cart" element={<Cart totalItems={totalItems} />} />
        <Route path="/Profile" element={<Profile totalItems={totalItems} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

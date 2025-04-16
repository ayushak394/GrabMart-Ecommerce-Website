import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ProductList from "./Products";
import Sidebar from "./Sidebar";
import useTokenCheck from "../hooks/tokencheck";
import "../CSS/HomePage.css";

const Homepage = ({ totalItems, refreshCart }) => {
  useTokenCheck();

  const [sortCriteria, setSortCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showThankYouMsg, setShowThankYouMsg] = useState(false); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paymentSuccess") === "true") {
      setShowThankYouMsg(true); 
      setTimeout(() => {
        setShowThankYouMsg(false); 
      }, 5000);
    }
  }, []);

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

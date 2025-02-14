import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ProductList from "./Products";
import Sidebar from "./Sidebar";
import useTokenCheck from "../hooks/tokencheck";
import "../CSS/HomePage.css";
const Homepage = ({ totalItems }) => {
  useTokenCheck();

  const [sortCriteria, setSortCriteria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="HomePage">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalItems={totalItems}
        />
        <Sidebar setSortCriteria={setSortCriteria} />
        <ProductList sortCriteria={sortCriteria} searchQuery={searchQuery} />
        <Footer />
      </div>
    </>
  );
};

export default Homepage;

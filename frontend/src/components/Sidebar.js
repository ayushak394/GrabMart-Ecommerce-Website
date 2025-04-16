import React from "react";
import "../CSS/Sidebar.css";

const Sidebar = ({ setSortCriteria }) => {
  return (
    <div className="sidebar">
      <h1>Filters</h1>
      <h3>Price</h3>
      <button onClick={() => setSortCriteria("LowtoHigh")}>
        {" "}
        Low to High{" "}
      </button>
      <button onClick={() => setSortCriteria("HightoLow")}>
        {" "}
        High to Low{" "}
      </button>

      <h3>Name</h3>
      <button onClick={() => setSortCriteria("NameAZ")}> A - Z </button>
      <button onClick={() => setSortCriteria("NameZA")}> Z - A </button>

      <h3>Release Date</h3>
      <button onClick={() => setSortCriteria("NewesttoOldest")}>
        Newest to Oldest
      </button>
      <button onClick={() => setSortCriteria("OldesttoNewest")}>
        Oldest to Newest
      </button>

      <h3>Stock Left</h3>
      <button onClick={() => setSortCriteria("Lowest")}>Lowest</button>
      <button onClick={() => setSortCriteria("Highest")}>Highest</button>
    </div>
  );
};

export default Sidebar;

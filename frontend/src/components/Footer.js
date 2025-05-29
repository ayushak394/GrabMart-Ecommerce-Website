import "../CSS/Footer.css";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <div className="Grabmarts">
        <h1>Grab Mart</h1>
        <i className="bx bx-cart-add"></i>
      </div>

      <p className="copyright">&copy; 2025 GrabMart. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Products.css";

import { jwtDecode } from "jwt-decode";

const ProductList = ({ sortCriteria, searchQuery, refreshCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${baseURL}/products`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products", error);
        setLoading(false);
      });
  }, []);

  const filterandsortedProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortCriteria) {
        case "LowtoHigh":
          return a.price - b.price;
        case "HightoLow":
          return b.price - a.price;
        case "NameAZ":
          return a.name.localeCompare(b.name);
        case "NameZA":
          return b.name.localeCompare(a.name);
        case "NewesttoOldest":
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case "OldesttoNewest":
          return new Date(a.releaseDate) - new Date(b.releaseDate);
        case "Lowest":
          return a.stock - b.stock;
        case "Highest":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  if (loading) {
    return <p>Loading...</p>;
  }

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

  const addToCart = async (product) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Please login first.");
        return;
      }
      const productData = {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      };

      await axios.post(`${baseURL}/cart/add`, {
        userId,
        product: productData,
      });

      refreshCart();
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  return (
    <div className="product-list">
      {filterandsortedProducts.map((product) => (
        <div key={product._id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>
          <p className="price">
            <b textcolor="black">Price:</b> ₹{product.price}
          </p>
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;

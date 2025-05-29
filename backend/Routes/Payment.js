const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.post("/create-order", async (req, res) => {
  const { amount, name, email, phone } = req.body;

  console.log("Received payment request:", req.body);

  try {
    const orderResponse = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_email: email,
          customer_phone: phone,
          customer_name: name,
        },
        order_meta: {
          return_url: "https://grab-mart-ecommerce-website.vercel.app/Home?paymentSuccess=true",
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
          "Content-Type": "application/json",
        },
      }
    );

    const sessionId = orderResponse.data.payment_session_id;

    console.log("Order created. Session ID:", sessionId);

    res.json({ payment_session_id: sessionId });
  } catch (err) {
    console.error("Payment error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

module.exports = router;

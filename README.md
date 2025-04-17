# 🛒 GrabMart: E-Commerce Project

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Twilio](https://img.shields.io/badge/Twilio-FF8A00?style=flat&logo=twilio&logoColor=white)](https://www.twilio.com/)
[![Cashfree](https://img.shields.io/badge/Cashfree-00457C?style=flat&logo=paypal&logoColor=white)](https://www.cashfree.com/)

---

GrabMart is a full-stack e-commerce web application built using the MERN stack — MongoDB, Express.js, React, and Node.js — with secure OTP authentication via Twilio and payment processing via Cashfree.

## 🚀 Features

- ✅ User registration and login with **OTP authentication via Twilio**
- 🛍️ Product listing and category-based filtering
- 🛒 Cart management (Add/Remove/Quantity update)
- 💳 **Secure Checkout** with **Cashfree** payment gateway integration
- 📷 File uploads for user profile pictures
- 🔐 JWT-based user session authentication

---

## 📦 Installation

Follow these steps to set up and run the project locally:

### ✅ Prerequisites

- Node.js (LTS version)
- MongoDB (Local with Compass or Atlas Cloud)

---

## 🛠 Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/grabmart.git
cd grabmart
```

2️⃣ **Install Dependencies** :

Install packages for both frontend and backend:
```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

3️⃣ **Configure Environment Variables** :

Create a .env file inside the backend directory with the following:
```bash
MONGO_URL=mongodb://localhost:27017/E-commerce
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_SERVICE_SID=your_twilio_service_sid

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret
```

4️⃣ **MongoDB Setup** :

Import sample products dataset if needed:
```bash
# Assuming you have MongoDB shell installed
mongoimport --db E-commerce --collection products --file backend/data/E-commerce.products.json --jsonArray
```

5️⃣ **Start the Application** :

Start the Backend:
```bash
cd backend
node app.js
```

Start the Frontend:
```bash
cd ../frontend
npm start
```
---

🗂️ **File Uploads** :

Make sure a directory named uploads exists in the backend:
```bash
mkdir backend/uploads
```
---

🛠 **Tech Stack**

Frontend: React, HTML5, CSS3

Backend: Node.js, Express.js

Database: MongoDB (Compass/Atlas)

Auth: JWT + Twilio OTP

Payments: Cashfree API

---

📜 **License** :

This project is created for learning and educational purposes. Contributions and improvements are welcome!

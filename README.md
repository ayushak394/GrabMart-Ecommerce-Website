# 🛒 GrabMart: E-Commerce Project

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vonage](https://img.shields.io/badge/Vonage-00457C?style=flat&logo=vonage&logoColor=white)](https://www.vonage.com/)
![Redis](https://img.shields.io/badge/Redis-D32F2F?style=flat&logo=redis&logoColor=white)
[![Cashfree](https://img.shields.io/badge/Cashfree-00457C?style=flat&logo=paypal&logoColor=white)](https://www.cashfree.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-D14836?style=flat&logo=mail&logoColor=white)](https://www.emailjs.com/)

GrabMart is a full-stack e-commerce web application built with the MERN stack — MongoDB, Express.js, React, and Node.js. Users can register and log in using Vonage OTP, browse products by category, manage their cart, securely pay via Cashfree, upload profile pictures using Cloudinary, and receive email notifications via EmailJS. OTPs are securely managed using an online Redis service with expiration for better performance and scalability. It provides a seamless shopping experience with modern UI and secure authentication.

## 🚀 Features

- ✅ User registration and login with OTP authentication via Vonage
- 🔑 OTP storage and verification using online Redis instance
- 🛍️ Product listing and category-based filtering
- 🛒 Cart management (Add/Remove/Quantity update)
- 💳 Secure Checkout with Cashfree payment gateway integration
- 📷 Profile picture upload and storage using Cloudinary
- 🔐 JWT-based user session authentication
- ✉️ Email notifications (Order confirmation) powered by EmailJS

## 📦 Installation

Follow these steps to set up and run the project locally:

### ✅ Prerequisites

- Node.js (LTS version)
- MongoDB (Local with Compass or Atlas Cloud)
- Vonage, CashFree, Cloudinary, Redis (Online Managed Service), EmailJS accounts (Free tier works for development)

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
MONGO_URL=your_mongo_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

# Vonage Configuration
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret

# Redis Configuration
REDIS_URL=your_redis_connection_string

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create another .env file in the frontend directory with the following:
```bash
REACT_APP_API_BASE_URL=http://localhost:4000

# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
```
This tells the React frontend where to send API requests. Update the port if your backend runs on a different one.

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
## 🌐 Environment Setup Notes

If you're running this project locally instead of using the hosted version:

Replace the hosted MONGO_URL in .env with your local MongoDB URI (e.g. mongodb://localhost:27017/E-commerce)

Set REACT_APP_API_BASE_URL in frontend/.env to your local backend URL (e.g. localhost:4000)

Make sure to create a Redis account with a managed instance and set REDIS_URL accordingly in backend .env

## 🛠 Tech Stack

Frontend: React, HTML5, CSS3

Backend: Node.js, Express.js

Database: MongoDB (Compass/Atlas)

Auth: JWT + Vonage OTP 

OTP Storage: Redis (Online Managed Service)

Payments: Cashfree API

Image Hosting: Cloudinary

Email Notifications: EmailJS

## 🌐 Live Demo

🔗 [View GrabMart Live](https://grab-mart-ecommerce-website.vercel.app/)

## 📜 License

This project is created for learning and educational purposes. Contributions and improvements are welcome!

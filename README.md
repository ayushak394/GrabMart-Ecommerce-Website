# 🛒 GrabMart: E-Commerce Project

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cashfree](https://img.shields.io/badge/Cashfree-00457C?style=flat&logo=paypal&logoColor=white)](https://www.cashfree.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-D14836?style=flat&logo=mail&logoColor=white)](https://www.emailjs.com/)

GrabMart is a full-stack e-commerce web application built using **Next.js (TypeScript)** for the frontend and **Node.js + Express** for the backend. Users can register and log in using email-based authentication, browse products by category, manage their cart, securely pay via Cashfree, upload profile pictures using Cloudinary, and receive email notifications via EmailJS. It provides a seamless shopping experience with modern UI and secure authentication.

## 🚀 Features

- 🔐 JWT-based Authentication  
- 🛍️ Product Listing & Category Filtering  
- 🛒 Dynamic Cart System (Real-time updates with Context + SWR)  
- 💳 Secure Checkout with Cashfree Payment Gateway  
- 📷 Profile Image Upload using Cloudinary  
- ✉️ Email Notifications via EmailJS  
- ⚡ Optimized UI with Next.js App Router  
- 🔄 Client-side Data Fetching using SWR  
- 🎯 Fully Type-safe Frontend using TypeScript

---

## 🛠 Tech Stack

### 🖥 Frontend
- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS / Custom CSS
- SWR (Data Fetching & Caching)

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### 🔐 Authentication
- JSON Web Tokens (JWT)

### 💳 Payments
- Cashfree Payment Gateway

### ☁️ Services
- Cloudinary (Image Hosting)
- EmailJS (Email Notifications)

---

## 📦 Installation

Follow these steps to set up and run the project locally:

### ✅ Prerequisites

- Node.js (LTS version)
- MongoDB (Local or Atlas)
- Cashfree, Cloudinary, EmailJS accounts

## 🛠 Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/grabmart.git
cd grabmart
```

2️⃣ **Install Dependencies** :

Install packages for both frontend and backend:
```bash
cd client
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

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create another .env file in the client directory with the following:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_user_id
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
cd ../client
npm run dev
```

## 🌐 Live Demo

🔗 [View GrabMart Live](https://grab-mart-ecommerce-website.vercel.app/)

## 📜 License

This project is created for learning and educational purposes. Contributions and improvements are welcome!

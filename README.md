🛒 GrabMart: E-Commerce Project
GrabMart is a full-stack e-commerce project built using the MERN Stack (MongoDB, Express, React, and Node.js).

🚀 Features
User authentication (Login/Signup)
Product listing & filtering
Shopping cart functionality
Secure checkout with payment integration
Admin dashboard for managing products and orders

📦 Installation
Follow these steps to set up and run the project locally.

✅ Prerequisites
Make sure you have the following installed:

Node.js (Latest LTS version recommended)
MongoDB (Running locally or using MongoDB Atlas)

🛠 Setup
1️⃣ Clone the Repository
git clone https://github.com/yourusername/GrabMart.git  
cd GrabMart  

2️⃣ Install Dependencies
Navigate to the project directory and install dependencies for both frontend and backend:

cd frontend  
npm install  
cd ../backend  
npm install  

3️⃣ Configure Environment Variables
Create a .env file in the backend directory and set up your MongoDB connection:
MONGO_URL=mongodb://localhost:27017/E-commerce  // Replace the connection string with your MongoDB Compass/Atlas link if needed.

4️⃣ Start the Frontend
cd frontend  
npm start  

To return to the main directory:

cd .. 

5️⃣ Start the Backend
cd backend  
node app.js  


6️⃣ Configure Environment Variables
Create a .env file in the backend directory and set up the necessary environment variables:
MONGO_URL=mongodb://localhost:27017/E-commerce  # Replace with your MongoDB Compass/Atlas link if needed.
JWT_SECRET=your_secret_key  # Replace with a secure secret key for JWT.
JWT_EXPIRES_IN=1d  # Set JWT expiration time (e.g., 1d, 7d, etc.).

📂 MongoDB Setup

A sample dataset is provided to populate the products collection.
Dataset file: E-commerce.products.json

🛠 Tech Stack
Frontend: React, HTML, CSS, Bootstrap
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)

🗂️ File Uploads:
Ensure that a folder named **uploads** exists in the backend directory, as all user profile pictures will be stored there.  

If the folder does not exist, create it manually:  
mkdir backend/uploads

📜 License
This project is for educational purposes and is open for further improvements.
🚀 Feel free to contribute and enhance this project!






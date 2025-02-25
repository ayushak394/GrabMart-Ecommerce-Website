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
sh
Copy
Edit
git clone https://github.com/yourusername/GrabMart.git
cd GrabMart
2️⃣ Install Dependencies
Navigate to the project directory and install dependencies for both frontend and backend:

sh
Copy
Edit
cd frontend
npm install
cd ../backend
npm install
If any packages are missing, install them using:

sh
Copy
Edit
npm install
3️⃣ Configure Environment Variables
Create a .env file in the backend directory and set up your MongoDB connection:

sh
Copy
Edit
MONGO_URL=mongodb://localhost:27017/E-commerce
Replace the connection string with your MongoDB Compass/Atlas link if needed.

4️⃣ Start the Frontend
sh
Copy
Edit
cd frontend
npm start
To return to the main directory:

sh
Copy
Edit
cd ..
5️⃣ Start the Backend
sh
Copy
Edit
cd backend
node app.js
To return to the main directory:

sh
Copy
Edit
cd ..
📂 MongoDB Setup
A sample dataset is provided to populate the products collection.

Dataset file: E-commerce.products.json
Import Command:
sh
Copy
Edit
mongoimport --db E-commerce --collection products --file E-commerce.products.json --jsonArray
🛠 Tech Stack
Frontend: React, HTML, CSS, Bootstrap
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
📜 License
This project is for educational purposes and is open for further improvements.

🚀 Feel free to contribute and enhance this project!

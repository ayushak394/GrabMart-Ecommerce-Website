GrabMart: E-Commerce Project

This is a full-stack e-commerce project made using MongoDB, Express, React, and Node.js (MERN Stack).

Installation

Follow these steps to set up and run the project locally.

Prerequisites

Node.js installed on your system

MongoDB installed and running locally or using MongoDB Atlas

Setup

Install Dependencies
Navigate to the project directory and run the following command in both the frontend and backend directories:

cd frontend npm install cd .. cd backend npm install cd ..

If any libraries are missing, install them using:

npm install

Start the Frontend
cd frontend npm start

To return to the main project directory, use:

cd ..

Start the Backend
cd backend node app.js

To return to the main project directory, use:

cd ..

Configure the Environment Variables
Replace the following line in the .env file:

MONGO_URL=mongodb://localhost:27017/E-commerce

with your MongoDB Compass connection link and database collection name.

MongoDB Setup

A sample dataset has been provided to populate the products collection. The file is named:

E-commerce.products.json

Import this file into your MongoDB database under the products collection.

License

This project is for educational purposes and open for further improvements.

Feel free to contribute and enhance this project!

require("dotenv").config(); // Helps keep sensitive info like mongoURL out of code but have access to it as well
const express = require("express"); // Used to create server and handle HTTP requests
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Helps avail data in a format that your code can understand and work with
const cors = require("cors"); // Cross Origin Resource Sharing - Allows to accept req. from diff domains.

const app = express(); // Creating an instance(creating personal copy of express server) - to handle incoming requests to the server

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Initializing CORS

app.use("/uploads", express.static("uploads"));

mongoose // To connect to server using string storing in .env file
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection failed to MongoDB", err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`); // Start the server
});

const authRoutes = require("./Routes/Authentication"); // to import routes into main app
app.use("/auth", authRoutes); // tells express to use the import authRoutes for any req. that starts with /auth

const userRoutes = require("./Routes/UserAuth");
const authenticationToken = require("./Middleware/authenticateToken");
app.use("/user", authenticationToken, userRoutes);

const ProfileRoutes = require("./Routes/Profile");
app.use("/Profile", ProfileRoutes);

const productRoutes = require("./Routes/Product");
app.use("/", productRoutes);

const cartRoutes = require("./Routes/Cart");
app.use("/cart", cartRoutes);

const mongoose = require("mongoose"); // Helps connect nodejs to MongoDB

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic: { type: String },
});

module.exports = mongoose.model("User", userSchema); // Model - A tool that helps work(Add,Update,Delete) with the users collection in the DB.
// Model is exported so that it can be used in other files as well.

// Flow: Clusters(Group of servers where databases are stored) → Contains Database → Contains Collections (Like tables in SQL) → Managed by Mongoose using Schema → Interacted with via Model.

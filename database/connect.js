// require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

module.exports = async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Database.");
  } catch (error) {
    throw error;
  }
};

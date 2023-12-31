const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const url = process.env.MONGO_URI;
const port = process.env.PORT;

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(
      `Unable to connect with Mongo DB: ${error.message}`.cyan.underline
    );
    process.exit(1);
  }
};

module.exports = connectDb;

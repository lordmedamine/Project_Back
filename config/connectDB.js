const mongoose = require("mongoose");

const connect = async () => {
  try {
    console.log("connecting to DB");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully!");
  } catch (error) {
    console.log("connection failed");
    console.log(error);
  }
};

module.exports = connect;

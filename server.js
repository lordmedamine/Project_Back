//require express
const express = require("express");
const connect = require("./config/connectDB");

//create instance
const app = express();
//middleware
app.use(express.json());

const cors = require("cors"); //access to send requests
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

require("dotenv").config();
//connect to DB
connect();

app.listen(process.env.PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running on PORT ${process.env.PORT}`);
});
// Routes for users
app.use("/api/user", require("./Routes/Users"));

// Routes for products
app.use("/api/product", require("./Routes/Product"));

// Routes for orders
app.use("/api/order", require("./Routes/Order"));

const jwt = require("jsonwebtoken");
const user = require("../Models/User");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).send({ msg: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.SEKRET_KEY); // Verify token
    const foundUser = await user.findById(decoded._id); // Find user by ID

    if (!foundUser) {
      return res.status(401).send({ msg: "Unauthorized. User not found." });
    }

    req.user = foundUser; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).send({ msg: "Invalid token.", error: error.message }); // Send appropriate error message
  }
};

module.exports = isAuth;

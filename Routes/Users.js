const express = require("express");
const {
  register,
  login,
  deleteUser,
  resetPassword,
  getAllUsers,
} = require("../Controllers/Users");

const router = express.Router();

// Route to register a new user
router.post("/register", register);

// Route to log in a user
router.post("/login", login);

// Route to delete a user by ID
router.delete("/:_id", deleteUser);

// Route to reset a user's password by ID
router.put("/:_id/reset-password", resetPassword);

router.get("/all", getAllUsers); // Add route to fetch all users

module.exports = router;

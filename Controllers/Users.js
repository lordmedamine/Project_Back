const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Ensure secret key is defined
if (!process.env.SEKRET_KEY) {
  throw new Error(
    "Secret key (SEKRET_KEY) is missing in environment variables."
  );
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, age, phone, photo, role } = req.body;

    // Check if email already exists (case-insensitive)
    const foundUserEmail = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });
    if (foundUserEmail) {
      return res.status(400).send({ msg: "Email already exists!" });
    }

    // Check if username already exists (case-insensitive)
    const foundUserName = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });
    if (foundUserName) {
      return res.status(400).send({ msg: "Username already exists!" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      phone,
      photo,
      role,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.SEKRET_KEY, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .send({ msg: "User registered successfully!", newUser, token });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ msg: "Error during registration", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (case-insensitive)
    const foundUser = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });
    if (!foundUser) {
      return res.status(400).send({ msg: "Email or password invalid!" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(400).send({ msg: "Email or password invalid!" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: foundUser._id }, process.env.SEKRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({ msg: "Login successful!", foundUser, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ msg: "Error during login", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.params; // Using '_id' now

    const deletedUser = await User.findByIdAndDelete(_id); // Querying by '_id'
    if (!deletedUser) {
      return res.status(404).send({ msg: "User not found!" });
    }

    res.status(200).send({ msg: "User deleted successfully!" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).send({ msg: "Error deleting user", error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { _id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .send({ msg: "New password must be at least 6 characters long!" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found!" });
    }

    res.status(200).send({ msg: "Password updated successfully!" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).send({ msg: "Error updating password", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords for security
    res.status(200).send({ msg: "Users retrieved successfully!", users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ msg: "Error retrieving users", error });
  }
};

const express = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

// register user
router.post("/register", async (req, res) => {
  console.log("Request body:", req.body);

  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.trim().length < 3) {
    return res.status(400).send("Name must be at least 3 characters long");
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("Email is already registered");
    }

    const user = new UserModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    await user.save();
    res.json({ message: "User signed up successfully" });
  } catch (err) {
    res.status(400).send("Error signing up user: ", err.message);
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const data = await user.toJSON();

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid password");
    }

    const auth_token = await user.getJWT();
    if (!auth_token) {
      return res.status(500).send("Error generating auth token");
    }

    res.json({
      data: data,
      accessToken: auth_token,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.log("Error logging in ", err);
    return res.status(500).send("Error logging in user: ", err.message);
  }
});

module.exports = router;

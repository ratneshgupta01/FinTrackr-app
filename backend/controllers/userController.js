const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/**
 * Registers a new user via a POST request.
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  // Check if user already exists.
  const userAlreadyInDb = await User.findOne({ email });
  if (userAlreadyInDb) {
    res.status(400);
    throw new Error(`This email is already registered! ${userAlreadyInDb}`);
  }

  // Generate hash of the password.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      status: "success",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

/**
 * Authenticate a user via a POST request.
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      status: "success",
      message: "Login successful.",
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials.");
  }
});

/**
 * Fetches the details of a user.
 * @route GET /api/users/me
 * @access Private
 */
const fetchUserDetails = asyncHandler(async (req, res) => {
  res.json({
    status: "Sucess",
    message: "Fetched user details.",
    user: req.user,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY);
};

module.exports = { registerUser, loginUser, fetchUserDetails };

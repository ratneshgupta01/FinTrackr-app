const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  fetchUserDetails,
} = require("../controllers/userController");

router.post(
  "/",
  [
    body("name", "Name can not be empty.").isLength({ min: 1 }),
    body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail(),
    body("password", "Password can not be empty.").isLength({ min: 1 }),
  ],
  registerUser
);
router.post(
  "/login",
  [
    body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail(),
    body("password", "Password can not be empty.").isLength({ min: 1 }),
  ],
  loginUser
);
router.get("/me", protect, fetchUserDetails);

module.exports = router;

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

import User from '../models/User.js';
import fetchuser from '../middleware/fetchuser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ChanakyaNiti';
const router = express.Router();

// Route 1: Create a User using: POST "/api/auth/signup". No Login Required
router.post('/signup', [
  // Setting a validation so that input value will be verified before sending to the dataset
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry a user with this email already exists." });
    }

    // Implementing a hashing system to protect the password using 'bcrypt' package
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securePassword,
    });

    const data = {
      user: {
        id: user.id
      }
    }

    // jwt will signature a token and give it to the user after login or say after verification/authentication
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// Route 2: Authenticate a User using: POST "/api/auth/login". No Login Required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  console.log('Login request received:', req.body);
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

// Route 3: Get logged-in User Details using: POST "/api/auth/getuser". Login Required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
});

export default router;

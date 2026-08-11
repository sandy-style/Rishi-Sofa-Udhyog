import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { response } from "express";
import userModel from "../models/users.js";
// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
// ROUTE FOR REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // To check if user already exists
    const alreadyExists = await userModel.findOne({ email });

    if (alreadyExists) {
      return res.json({
        success: false,
        message: "User from this Email already exists",
      });
    }
    // validation of email format and password difficulty
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password length must not be less than 8 characters.",
      });
    }
    if (!/[A-Z]/.test(password)) {
      return res.json({
        success: false,
        message: "At least one character should be uppercasse",
      });
    }
    if (!/[\d]/.test(password)) {
      return res.json({
        success: false,
        message: "At least one number is required",
      });
    }
    // hashing password and registering user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    return res.json({
      success: true,
      message: `user :${name} is created successfully`,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ROUTE FOR LOGIN USER
const logUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User doesnot exist. Please register",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.json({
        success: false,
        message: "Please enter a correct password",
      });
    }
    const token = createToken(user._id);

    return res.json({
      success: true,
      name: user.name,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// ROUTE FOR ADMIN LOGIN
const adminLogin = async (req, res) => {
  const { user, password } = req.body;
  try {
    if (
      user === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(user + password, process.env.JWT_SECRET);
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { registerUser, logUser, adminLogin };

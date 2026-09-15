import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/users.js";
import { sendEmail } from "../config/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      if (!alreadyExists.isVerified) {
        const randomCode = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();

        const verificationCode = await bcrypt.hash(randomCode, 6);
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        alreadyExists.verificationCode = verificationCode;
        alreadyExists.verificationCodeExpires = verificationCodeExpires;

        await alreadyExists.save();

        await sendEmail(email, randomCode);

        return res.json({
          success: true,
          message: "New Token created",
          verify: false,
        });
      } else {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }
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
        message: "At least one character should be uppercase",
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

    const randomcode = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationCode = await bcrypt.hash(randomcode, 8);

    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });

    await sendEmail(email, randomcode);

    await newUser.save();

    return res.json({
      success: true,
      verify: false,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
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

    // Google-only account
    if (!user.password) {
      return res.json({
        success: false,
        message: "This account uses Google login. Please login with Google.",
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.json({
        success: false,
        message: "Please enter a correct password",
      });
    }

    if (!user.isVerified) {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

      const verificationCode = await bcrypt.hash(randomCode, 6);

      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpires;

      await user.save();

      await sendEmail(email, randomCode);

      return res.json({
        success: false,
        message:
          "Email is not verified. A new verification code has been sent.",
        verify: false,
      });
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      name: user.name,
      email: user.email,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ROUTE FOR GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google's ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const emailVerified = payload.email_verified;

    if (!email || !emailVerified) {
      return res.json({
        success: false,
        message: "Google email is not verified",
      });
    }

    // First find user using Google ID
    let user = await userModel.findOne({ googleId });

    // If Google ID doesn't exist, check whether email already exists
    if (!user) {
      user = await userModel.findOne({ email });
    }

    // Create a new user
    if (!user) {
      user = new userModel({
        name,
        email,
        password: null,
        googleId,
        isVerified: true,
        verificationCode: "",
        verificationCodeExpires: null,
      });
    } else {
      // Existing user
      if (!user.googleId) {
        user.googleId = googleId;
      }

      user.isVerified = true;
      user.verificationCode = "";
      user.verificationCodeExpires = null;
    }

    await user.save();

    // Use the same JWT system as normal login
    const token = createToken(user._id);

    return res.json({
      success: true,
      name: user.name,
      email: user.email,
      message: "Successfully logged in with Google",
      token,
    });
  } catch (error) {
    console.log("Google login error:", error);

    return res.json({
      success: false,
      message: "Google authentication failed",
    });
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
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email could not be verified",
      });
    }

    if (
      !user.verificationCodeExpires ||
      Date.now() > user.verificationCodeExpires.getTime()
    ) {
      return res.json({
        success: false,
        message: "Verification code expired",
      });
    }

    const isMatch = await bcrypt.compare(
      verificationCode,
      user.verificationCode,
    );

    if (isMatch) {
      user.isVerified = true;
      user.verificationCode = "";
      user.verificationCodeExpires = null;

      const token = createToken(user._id);

      await user.save();

      return res.json({
        success: true,
        message: "Email is successfully verified",
        token,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.json({
        success: false,
        message: "verification code doesnot match",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = await bcrypt.hash(randomCode, 12);
    user.verificationCodeExpires = Date.now() + 3600000;

    await user.save();

    await sendEmail(email, randomCode);

    return res.json({
      success: true,
      message: "New verification code sent",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const userData = {
      email: user.email,
      name: user.name,
    };
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  logUser,
  adminLogin,
  verifyUser,
  resendVerificationCode,
  googleLogin,
  getUserData,
};

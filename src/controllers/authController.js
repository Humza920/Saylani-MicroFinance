const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/generatetoken");

exports.register = async (req, res) => {
  const {username, email, password ,cnic} = req.body;
  console.log(username);
  
  try {
    if (!username || !email || !password  || !cnic) {
      return res.status(400).json({ success: false, message: "Fill all fields (including role & cnic)" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid Email address" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be strong (uppercase, lowercase, number, symbol, 8+ characters)",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALTED_ROUNDS));

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      cnic
    });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPass } = user._doc;

    res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: userWithoutPass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Enter your Email" });
    if (!password) return res.status(400).json({ success: false, message: "Enter your Password" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPass } = user._doc;
    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: userWithoutPass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    res.send("logout successful")
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req , res) => {
  try {
    const user_id = req.user._id
    const user = await User.findById(user_id).select("-password")
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
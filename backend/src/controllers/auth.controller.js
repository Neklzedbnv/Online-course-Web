const User = require("../models/User");
const { signToken } = require("../utils/token");
const sendEmail = require("../utils/sendEmail");


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
    });

  
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Registration successful",
        html: `
          <h2>Welcome!</h2>
          <p>You have successfully registered.</p>
        `,
      });
    } catch (mailError) {
      console.error("Email error:", mailError.message);
      
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: "Registered",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: "Server error",
      error: e.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id, role: user.role });

    res.json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: "Server error",
      error: e.message,
    });
  }
};

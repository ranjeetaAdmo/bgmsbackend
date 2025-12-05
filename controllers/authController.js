const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const emailService = require('../services/emailService');

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Please provide all requested fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userService.createUser(fullname, email, hashedPassword);

    // Fetch the newly created user (to get user_type for role)
    const newUser = await userService.findUserByEmail(email);

    let role = 'user';
    if (newUser.user_type === 2) {
      role = 'admin';
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role },
      process.env.JWT_SECRET || "mytemporarysecretkey",
      { expiresIn: "15m" }
    );

    // Store token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
       maxAge: 24 * 60 * 60 * 1000, // 1 day
       path: "/",
    });

    // Send response SAME AS LOGIN
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        role,
        token
      }
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }
 
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let role = 'user';
    if(user.user_type === 2){
      role = 'admin';
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role },
        process.env.JWT_SECRET || "mytemporarysecretkey",
      { expiresIn: "15m" }
    );
    // store JWT in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,       // prevent JS access
      secure: false,         // only over HTTPS
      sameSite: "lax",   // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    res.json({
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        token,
        role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No session" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });  // decoded has userId, email, role
  } catch (err) {
    return res.status(401).json({ msg: "Invalid session" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "lax",
      path: "/"
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const resetToken = require('crypto').randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', [resetToken, tokenExpiry, email], async (err2) => {
            if (err2) return res.status(500).json({ error: 'Failed to save token' });

            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
            try {
                await emailService.sendResetEmail(email, resetLink);
                res.json({ message: 'Password reset link sent to email' });
            } catch (mailErr) {
                res.status(500).json({ error: 'Failed to send email' });
            }
        });
    });
};

exports.resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND reset_token = ?', [email, token], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid token or email' });

        const user = results[0];
        if (Date.now() > user.reset_token_expiry) {
            return res.status(400).json({ error: 'Token expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?', [hashedPassword, email], (err2) => {
            if (err2) return res.status(500).json({ error: 'Failed to reset password' });
            res.json({ message: 'Password reset successful' });
        });
    });
};
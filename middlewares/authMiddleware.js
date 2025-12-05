const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = null;

  // 1️⃣ Check Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If not found, check Cookie token
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If still no token → unauthorized
  if (!token) {
    return res.status(401).json({ msg: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mytemporarysecretkey");
    req.user = decoded;  // attach user info to req object
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;

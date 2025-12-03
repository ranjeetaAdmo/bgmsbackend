const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1️⃣ Try Authorization header → Bearer token
  let token = null;
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ If not found, try cookie token
  if (!token) {
    token = req.cookies?.token;
  }

  // 3️⃣ If still no token → unauthorized
  if (!token) {
    return res.status(401).json({ msg: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mytemporarysecretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;

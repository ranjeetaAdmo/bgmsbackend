const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.cookies?.token;

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

const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// ===== CORS =====
// Allow cookies to be sent from frontend
app.use(cors({
  origin: "http://localhost:3000",  // your React frontend
  credentials: true                 // allow cookies / auth headers
}));

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());

// ===== Routes =====
app.use('/api', userRoutes);

// ===== 404 handler =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Global error handler =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

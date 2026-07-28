const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const app = express();

// Apply rate limiting to all requests
const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10);
const limiter = rateLimit({
  windowMs: (!isNaN(windowMinutes) ? windowMinutes : 15) * 60 * 1000,
  max: !isNaN(maxRequests) ? maxRequests : 100,
});
app.use(limiter);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "build")));

// Handle React Router - send all requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

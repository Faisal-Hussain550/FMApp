const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy Users
const users = [
  { username: "testuser", password: "123456" },
  { username: "faisal", password: "password" },
  {username:"Admin",password:"1234"}
];

// Login API
app.post("/api/login", (req, res) => {
  const { Username, Password } = req.body;

  const user = users.find(
    (u) => u.username === Username && u.password === Password
  );

  if (user) {
    res.json({ success: true, message: "Login successful!", token: "fake-jwt-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Test GET API
app.get("/api/data", (req, res) => {
  res.json({ message: "This is test data", items: [1, 2, 3, 4] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
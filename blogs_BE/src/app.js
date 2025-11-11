require("dotenv").config();
const express = require("express");

const connectDB = require("./config/database");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(8080);
    console.log("listening on port 8080...");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

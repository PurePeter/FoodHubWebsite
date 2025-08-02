console.log("Starting FoodHub Backend Server v2..."); // Dấu hiệu để nhận biết server đã khởi động lại
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Nạp biến môi trường

const Dish = require("./models/Dish");

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Kết nối MongoDB ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Endpoints ---

// Endpoint để lấy tất cả món ăn
app.get("/api/dishes", async (req, res) => {
  try {
    const dishes = await Dish.find({});
    res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    // Gửi lỗi chi tiết về client để debug
    res.status(500).json({ 
      message: "Server error when fetching dishes", 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

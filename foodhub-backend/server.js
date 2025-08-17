console.log("Starting FoodHub Backend Server v2..."); // Dấu hiệu để nhận biết server đã khởi động lại
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
require("dotenv").config(); // Nạp biến môi trường

const Dish = require("./models/Dish");
const User = require('./models/User'); // Import User model
const BannerSlide = require('./models/BannerSlide'); // Import BannerSlide model

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

// Endpoint để phục vụ ảnh món ăn từ MongoDB
app.get('/api/dishes/:id/image', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish || !dish.imageData || !dish.contentType) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', dish.contentType);
    res.send(dish.imageData);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Tên người dùng hoặc email đã tồn tại." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
        message: "Đăng ký thành công!",
        user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        }
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      message: "Lỗi máy chủ khi đăng ký người dùng.", 
      error: error.message 
    });
  }
});

// Endpoint for user login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // On successful login, return user info (without password)
    res.status(200).json({
        message: "Đăng nhập thành công!",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ 
      message: "Lỗi máy chủ khi đăng nhập.", 
      error: error.message 
    });
  }
});


// Endpoint để lấy tất cả banner slides
app.get("/api/bannerslides", async (req, res) => {
  try {
    const bannerSlides = await BannerSlide.find({});
    res.json(bannerSlides);
  } catch (error) {
    console.error("Error fetching banner slides:", error);
    res.status(500).json({ 
      message: "Server error when fetching banner slides", 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
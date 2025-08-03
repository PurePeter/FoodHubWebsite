const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageData: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["main_course", "appetizer", "dessert", "drink"], // Ví dụ các danh mục
  },
});

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;

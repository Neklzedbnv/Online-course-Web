const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Programming", "Data Science", "Web Development", "AI Basics", "Blockchain", "Mobile Dev"],
      required: true
    },
    packages: {
      type: [String],
      default: ["basic", "premium", "vip"],
      enum: ["basic", "premium", "vip"]
    },
    priceUsd: {
      basic: { type: Number, required: true },
      premium: { type: Number, required: true },
      vip: { type: Number, required: true }
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    cover: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

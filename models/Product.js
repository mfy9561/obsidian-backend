const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String, default: 'OBSIDIAN' },
  description: { type: String, required: true },
  category:    { type: String, required: true, enum: ['Clothing', 'Shoes', 'Goggles', 'Accessories'] },
  price:       { type: Number, required: true },
  oldPrice:    { type: Number },
  badge:       { type: String },
  images:      [{ type: String }],
  colors:      [{ type: String }],
  sizes:       [{ type: String }],
  stock:       { type: Number, default: 100 },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

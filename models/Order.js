const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    Number,
  qty:      Number,
  size:     String,
  color:    String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: String,
    lastName:  String,
    street:    String,
    city:      String,
    zip:       String,
    country:   String,
  },
  paymentResult: {
    id:     String,
    status: String,
    email:  String,
  },
  subtotal:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice:    { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  isPaid:     { type: Boolean, default: false },
  paidAt:     Date,
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

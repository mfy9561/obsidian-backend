const router = require('express').Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentResult, subtotal, tax, totalPrice } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items' });
    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentResult,
      subtotal, tax, totalPrice, isPaid: true, paidAt: new Date(),
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'firstName email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// GET /api/orders  (admin)
router.get('/', protect, admin, async (req, res) => {
  const orders = await Order.find().populate('user', 'firstName email').sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id/status  (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = req.body.status;
  if (req.body.status === 'Delivered') order.deliveredAt = new Date();
  await order.save();
  res.json(order);
});

module.exports = router;

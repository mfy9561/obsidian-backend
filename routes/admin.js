const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({ isPaid: true }),
    ]);
    const totalRevenue = orders.reduce((a, o) => a + o.totalPrice, 0);

    // Monthly revenue (last 6 months)
    const monthly = {};
    orders.forEach(o => {
      const m = new Date(o.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthly[m] = (monthly[m] || 0) + o.totalPrice;
    });

    res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, monthly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

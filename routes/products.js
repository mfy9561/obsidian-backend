const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET /api/products  (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured) filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    let query = Product.find(filter);
    if (sort === 'price_asc')  query = query.sort({ price:  1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });
    if (sort === 'newest')     query = query.sort({ createdAt: -1 });
    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products  (admin only)
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id  (admin only)
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.files?.length) update.images = req.files.map(f => `/uploads/${f.filename}`);
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id  (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: 'Already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.firstName, ...req.body });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

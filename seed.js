const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Noir Shadow Hoodie', brand: 'OBSIDIAN', category: 'Clothing',
    price: 289, oldPrice: 380, badge: 'New',
    description: 'Premium heavyweight french terry hoodie with tonal embroidery and signature gold zipper pulls.',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50', '#5d4037'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 50, featured: true, rating: 4.9,
  },
  {
    name: 'Phantom Runner Elite', brand: 'OBSIDIAN', category: 'Shoes',
    price: 420, oldPrice: 520, badge: 'Best Seller',
    description: 'Carbon-fiber heel with premium knit upper for supreme street performance.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
    colors: ['#1a1a1a', '#ecf0f1', '#c0392b'], sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 30, featured: true, rating: 4.8,
  },
  {
    name: 'Obsidian Shield Goggles', brand: 'OBSIDIAN', category: 'Goggles',
    price: 340, badge: 'Limited',
    description: 'Polarized UV400 lenses with aerospace-grade titanium frame.',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80'],
    colors: ['#1a1a1a', '#c9a84c', '#2980b9'], sizes: ['One Size'],
    stock: 15, featured: true, rating: 5.0,
  },
  {
    name: 'Carbon Tactical Jacket', brand: 'OBSIDIAN', category: 'Clothing',
    price: 680, oldPrice: 820, badge: 'Sale',
    description: 'Military-inspired shell with YKK zippers and fully taped seams.',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50'], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 25, featured: true, rating: 4.7,
  },
  {
    name: 'Sovereign Leather Belt', brand: 'OBSIDIAN', category: 'Accessories',
    price: 195,
    description: 'Full-grain Italian leather with brushed gold hardware. Handcrafted in Milan.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],
    colors: ['#1a1a1a', '#8B4513'], sizes: ['32', '34', '36', '38', '40'],
    stock: 60, rating: 4.8,
  },
  {
    name: 'Apex Desert Boot', brand: 'OBSIDIAN', category: 'Shoes',
    price: 380, badge: 'New',
    description: 'Suede upper with crepe sole and waterproof treatment.',
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80'],
    colors: ['#d4a76a', '#1a1a1a', '#8B4513'], sizes: ['7', '8', '9', '10', '11'],
    stock: 20, rating: 4.6,
  },
  {
    name: 'Chrome Mirror Aviators', brand: 'OBSIDIAN', category: 'Goggles',
    price: 285,
    description: 'Classic pilot frame with polycarbonate mirror lenses and spring hinges.',
    images: ['https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80'],
    colors: ['#c9a84c', '#1a1a1a', '#a0a0a0'], sizes: ['One Size'],
    stock: 40, rating: 4.7,
  },
  {
    name: 'Ghost Slim Trousers', brand: 'OBSIDIAN', category: 'Clothing',
    price: 320,
    description: 'Japanese wool-blend with concealed button fly and slim taper.',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50', '#7f8c8d'], sizes: ['28', '30', '32', '34', '36'],
    stock: 35, rating: 4.5,
  },
  {
    name: 'Titanium Chain Necklace', brand: 'OBSIDIAN', category: 'Accessories',
    price: 450, badge: 'Limited',
    description: 'Surgical steel with 18K gold PVD coating. Waterproof and hypoallergenic.',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'],
    colors: ['#c9a84c', '#a0a0a0'], sizes: ['One Size'],
    stock: 10, featured: true, rating: 4.9,
  },
  {
    name: 'Stealth Zip Sweater', brand: 'OBSIDIAN', category: 'Clothing',
    price: 245,
    description: 'Merino wool-blend half-zip with ribbed collar and contrast side panels.',
    images: ['https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50', '#5d4037'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 45, rating: 4.6,
  },
  {
    name: 'Blackout Loafer', brand: 'OBSIDIAN', category: 'Shoes',
    price: 520, badge: 'Premium',
    description: 'Calfskin leather with stacked heel and gold metal loafer bit. Made in Italy.',
    images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50'], sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 18, rating: 4.8,
  },
  {
    name: 'Velour Tracksuit Set', brand: 'OBSIDIAN', category: 'Clothing',
    price: 380, oldPrice: 480, badge: 'Sale',
    description: 'Luxe velour with tonal piping and gold zipper pulls. Jacket + trouser set.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50', '#6c3483'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 22, rating: 4.4,
  },
  {
    name: 'Obsidian Signet Ring', brand: 'OBSIDIAN', category: 'Accessories',
    price: 320,
    description: 'Sterling silver with black onyx stone and hand-brushed finish.',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80'],
    colors: ['#c9a84c', '#a0a0a0', '#1a1a1a'], sizes: ['6', '7', '8', '9', '10'],
    stock: 12, rating: 4.9,
  },
  {
    name: 'Glacier Sport Goggles', brand: 'OBSIDIAN', category: 'Goggles',
    price: 290,
    description: 'Anti-fog lens with interchangeable color filter system for all conditions.',
    images: ['https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&q=80'],
    colors: ['#2980b9', '#1a1a1a', '#c9a84c'], sizes: ['One Size'],
    stock: 28, rating: 4.7,
  },
  {
    name: 'Onyx Leather Wallet', brand: 'OBSIDIAN', category: 'Accessories',
    price: 180,
    description: '8-card slim bifold in full-grain black leather with RFID blocking.',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594913?w=600&q=80'],
    colors: ['#1a1a1a', '#8B4513'], sizes: ['One Size'],
    stock: 55, rating: 4.8,
  },
  {
    name: 'Noir Denim Jacket', brand: 'OBSIDIAN', category: 'Clothing',
    price: 395, badge: 'New',
    description: 'Heavyweight selvedge denim with distressed hardware and signature back embroidery.',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 30, rating: 4.5,
  },
  {
    name: 'Minimalist Watch Band', brand: 'OBSIDIAN', category: 'Accessories',
    price: 120,
    description: 'Horween leather band with quick-release spring pins. Fits 18-22mm lugs.',
    images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80'],
    colors: ['#1a1a1a', '#8B4513', '#c9a84c'], sizes: ['18mm', '20mm', '22mm'],
    stock: 70, rating: 4.6,
  },
  {
    name: 'Chrome Dome Sneaker', brand: 'OBSIDIAN', category: 'Shoes',
    price: 340, badge: 'New',
    description: 'Tumbled leather upper with reflective tongue tab and air-cushioned sole.',
    images: ['https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80'],
    colors: ['#ecf0f1', '#1a1a1a', '#c9a84c'], sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 25, rating: 4.7,
  },
  {
    name: 'Silk Pocket Square Set', brand: 'OBSIDIAN', category: 'Accessories',
    price: 85,
    description: '100% Mulberry silk in three signature OBSIDIAN colorways.',
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80'],
    colors: ['#c9a84c', '#2c3e50', '#1a1a1a'], sizes: ['One Size'],
    stock: 80, rating: 4.8,
  },
  {
    name: 'Stealth Turtleneck', brand: 'OBSIDIAN', category: 'Clothing',
    price: 210,
    description: 'Fine merino roll-neck with zero-bulk seams. The perfect base layer.',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
    colors: ['#1a1a1a', '#2c3e50', '#7f8c8d'], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 40, rating: 4.6,
  },
  {
    name: 'Matte Shield Sunglasses', brand: 'OBSIDIAN', category: 'Goggles',
    price: 265, badge: 'Best Seller',
    description: 'Wraparound matte frame with gradient tint lenses. TR90 flexible frame.',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'],
    colors: ['#1a1a1a', '#5d4037', '#c9a84c'], sizes: ['One Size'],
    stock: 32, featured: true, rating: 4.8,
  },
  {
    name: 'Luxe Canvas Sneaker', brand: 'OBSIDIAN', category: 'Shoes',
    price: 195,
    description: 'Premium canvas with vulcanized sole, leather laces and gold eyelets.',
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80'],
    colors: ['#ecf0f1', '#1a1a1a'], sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 45, rating: 4.4,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected');

    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products inserted`);

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      firstName: 'Admin',
      lastName: 'Obsidian',
      email: 'admin@obsidian.com',
      password: hashedPassword,
      isAdmin: true,
    });
    console.log('✅ Admin user created: admin@obsidian.com / admin123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

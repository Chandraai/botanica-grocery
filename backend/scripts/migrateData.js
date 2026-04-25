require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const importData = async () => {
  try {
    await connectDB();
    
    // Check if connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Skipping migration because MongoDB is not connected.');
      process.exit(1);
    }

    // Clear existing products to prevent duplicates during testing
    await Product.deleteMany();

    // Read the products.json file
    const productsPath = path.join(__dirname, '../db/products.json');
    if (!fs.existsSync(productsPath)) {
      console.log('No products.json found to migrate.');
      process.exit(0);
    }
    
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // Map fields to new Mongoose schema
    const mappedProducts = productsData.map(p => ({
      customId: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice,
      image: p.image,
      stock: p.stock,
      description: p.description,
      unit: p.unit,
      rating: p.rating || 0
    }));

    await Product.insertMany(mappedProducts);
    
    console.log(`Data Imported! Added ${mappedProducts.length} products to MongoDB.`);
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();

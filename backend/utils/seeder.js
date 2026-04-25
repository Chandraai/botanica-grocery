const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Database already seeded. Skipping seeder.');
      return;
    }

    const productsPath = path.join(__dirname, '../db/products.json');
    if (!fs.existsSync(productsPath)) {
      console.log('No products.json found for seeding.');
      return;
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    const mappedProducts = productsData.map(p => ({
      customId: p.id,
      name: p.name,
      category: p.category,
      price: Math.round(p.price * 80),
      discountPrice: Math.round(p.discountPrice * 80),
      image: p.image,
      stock: p.stock,
      description: p.description,
      unit: p.unit,
      rating: p.rating || 0
    }));

    await Product.insertMany(mappedProducts);
    console.log(`Successfully seeded ${mappedProducts.length} products to MongoDB!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedProducts;

const Product = require('../models/Product');

// @desc    Get all products (with search, category, and sort)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    let sortObj = {};
    if (sort === 'price-asc') sortObj.discountPrice = 1;
    else if (sort === 'price-desc') sortObj.discountPrice = -1;
    else if (sort === 'name') sortObj.name = 1;
    else if (sort === 'rating') sortObj.rating = -1;

    const products = await Product.find(query).sort(sortObj);
    
    // Remap customId to id for frontend compatibility
    const mappedProducts = products.map(p => {
      const productData = p.toObject();
      productData.id = productData.customId;
      return productData;
    });
    
    res.json({
      success: true,
      count: mappedProducts.length,
      data: mappedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    // Check if ID is a valid MongoDB ObjectId, otherwise search by customId
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ customId: req.params.id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Remap customId to id for frontend compatibility
    const productData = product.toObject();
    productData.id = productData.customId;

    res.json({
      success: true,
      data: productData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    ]);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories
};

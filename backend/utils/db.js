const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'db');

/**
 * Read data from a JSON database file
 * @param {string} filename - The JSON file name (e.g., 'products.json')
 * @returns {any} Parsed JSON data
 */
function readDB(filename) {
  const filePath = path.join(DB_DIR, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, return default
      if (filename === 'cart.json') return { items: [], totalPrice: 0, totalItems: 0 };
      if (filename === 'orders.json') return [];
      return [];
    }
    throw err;
  }
}

/**
 * Write data to a JSON database file
 * @param {string} filename - The JSON file name
 * @param {any} data - Data to write
 */
function writeDB(filename, data) {
  const filePath = path.join(DB_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readDB, writeDB };

import axios from 'axios';

// Use production API URL from Vercel env, otherwise fallback to local hostname
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = (search = '', sort = '') => 
  api.get(`/products?search=${search}&sort=${sort}`);

export const getProductById = (id) => 
  api.get(`/products/${id}`);

export const getCategories = () => 
  api.get('/products/categories');

export const getProductsByCategory = (category) => 
  api.get(`/products/category/${category}`);

export const getCart = () => 
  api.get('/cart');

export const addToCart = (product) => 
  api.post('/cart/add', product);

export const updateCartItem = (productId, quantity) => 
  api.put('/cart/update', { productId, quantity });

export const removeFromCart = (id) => 
  api.delete(`/cart/remove/${id}`);

export const clearCart = () => 
  api.delete('/cart/clear');

export const createOrder = (orderData) => 
  api.post('/orders', orderData);

export const getOrderById = (id) => 
  api.get(`/orders/${id}`);

export default api;

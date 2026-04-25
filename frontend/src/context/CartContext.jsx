import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      const { data } = await apiAddToCart({
        productId: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
        unit: product.unit
      });
      if (data.success) {
        setCart(data.data);
        return true;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await updateCartItem(productId, quantity);
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await apiRemoveFromCart(productId);
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await apiClearCart();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

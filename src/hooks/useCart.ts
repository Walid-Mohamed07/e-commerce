"use client";

import { useState, useCallback } from "react";
import { cartService, Cart, CartCount } from "@/features/product/services/cart";

interface UseCartReturn {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
      setCartCount(cartData.items?.length || 0);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to fetch cart";
      setError(errorMessage);
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(
    async (productId: string) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCart = await cartService.removeCartItem(productId);
        setCart(updatedCart);
        setCartCount(updatedCart.items?.length || 0);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to remove item";
        setError(errorMessage);
        console.error("Error removing item:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCart = await cartService.updateCartItem(productId, {
          quantity,
        });
        setCart(updatedCart);
        setCartCount(updatedCart.items?.length || 0);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Failed to update item";
        setError(errorMessage);
        console.error("Error updating item:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart();
      setCart(null);
      setCartCount(0);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to clear cart";
      setError(errorMessage);
      console.error("Error clearing cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cart,
    cartCount,
    loading,
    error,
    fetchCart,
    removeItem,
    updateItem,
    clearCart,
  };
};

export default useCart;

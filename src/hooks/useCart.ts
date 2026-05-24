"use client";

import { useCartStore } from "./useCartStore";

/**
 * Backward-compatible wrapper around the Zustand cart store.
 * Prefer importing useCartStore directly for new components.
 */
const useCart = () => {
  const {
    cart,
    cartCount,
    isLoading: loading,
    error,
    fetchCart,
    addItem,
    addVisitorItem,
    removeItem,
    updateItem,
    clearCart,
  } = useCartStore();

  return {
    cart,
    cartCount,
    loading,
    error,
    fetchCart,
    addItem,
    addVisitorItem,
    removeItem,
    updateItem,
    clearCart,
  };
};

export { useCart };
export default useCart;

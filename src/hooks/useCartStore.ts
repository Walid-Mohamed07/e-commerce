"use client";

import { create } from "zustand";
import { cartService, Cart, CheckoutPayload, CheckoutResponse } from "@/features/product/services/cart";
import { visitorCartLib, VisitorCartProduct } from "@/lib/visitorCart";
import { getCookie } from "cookies-next";

const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!getCookie("token");
};

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  addVisitorItem: (product: VisitorCartProduct, quantity: number) => void;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<CheckoutResponse>;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  cartCount: 0,

  fetchCart: async () => {
    if (!isLoggedIn()) {
      const visitorCart = visitorCartLib.getCart();
      set({
        cart: visitorCart as unknown as Cart,
        cartCount: visitorCart.items.length,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const cartData = await cartService.getCart();
      set({
        cart: cartData,
        cartCount: cartData.items?.length ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      // Token was invalid (401 cleared by interceptor) — fall back to visitor cart
      if (err?.response?.status === 401) {
        const visitorCart = visitorCartLib.getCart();
        set({
          cart: visitorCart as unknown as Cart,
          cartCount: visitorCart.items.length,
          isLoading: false,
          error: null,
        });
        return;
      }
      set({
        error: err?.response?.data?.message ?? "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  addItem: async (productId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.addToCart({ productId, quantity });
      set({
        cart: updatedCart,
        cartCount: updatedCart.items?.length ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      // Token was invalid (401 cleared by interceptor) — fall back to visitor cart
      if (err?.response?.status === 401) {
        set({ isLoading: false, error: null });
        // Re-throw so the caller (Add.tsx) can retry via addVisitorItem
        throw err;
      }
      set({
        error: err?.response?.data?.message ?? "Failed to add item",
        isLoading: false,
      });
      throw err;
    }
  },

  addVisitorItem: (product: VisitorCartProduct, quantity: number) => {
    const updatedCart = visitorCartLib.addItem(product, quantity);
    set({
      cart: updatedCart as unknown as Cart,
      cartCount: updatedCart.items.length,
    });
  },

  removeItem: async (productId: string) => {
    if (!isLoggedIn()) {
      const updatedCart = visitorCartLib.removeItem(productId);
      set({
        cart: updatedCart as unknown as Cart,
        cartCount: updatedCart.items.length,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.removeCartItem(productId);
      set({
        cart: updatedCart,
        cartCount: updatedCart.items?.length ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to remove item",
        isLoading: false,
      });
      throw err;
    }
  },

  updateItem: async (productId: string, quantity: number) => {
    if (!isLoggedIn()) {
      const updatedCart = visitorCartLib.updateItem(productId, quantity);
      set({
        cart: updatedCart as unknown as Cart,
        cartCount: updatedCart.items.length,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const updatedCart = await cartService.updateCartItem(productId, {
        quantity,
      });
      set({
        cart: updatedCart,
        cartCount: updatedCart.items?.length ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to update item",
        isLoading: false,
      });
      throw err;
    }
  },

  clearCart: async () => {
    if (!isLoggedIn()) {
      visitorCartLib.clearCart();
      set({ cart: null, cartCount: 0 });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart();
      set({ cart: null, cartCount: 0, isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to clear cart",
        isLoading: false,
      });
      throw err;
    }
  },

  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartService.checkout(payload);
      // Clear the cart after successful checkout
      await cartService.clearCart();
      set({ cart: null, cartCount: 0, isLoading: false });
      return response;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to place order",
        isLoading: false,
      });
      throw err;
    }
  },

  setError: (error: string | null) => set({ error }),
}));

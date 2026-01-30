import { api } from "@/lib/axios";

// Types
export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CheckoutPayload {
  shippingAddress: string;
  phoneNumber: string;
  shippingNotes?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
  productImage?: string;
  productName?: string;
  subtotal?: number;
}

export interface Cart {
  items: CartItem[];
  total?: number;
  totalPrice?: number;
  tax?: number;
  shipping?: number;
}

export interface CartCount {
  count: number;
}

export interface CheckoutResponse {
  orderId: string;
  status: string;
  message?: string;
}

// Cart Service Functions
export const cartService = {
  /**
   * Get user's cart
   * GET /cart
   */
  getCart: async (): Promise<Cart> => {
    try {
      const response = await api.get<Cart>("/cart");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  /**
   * Get cart item count
   * GET /cart/count
   */
  getCartCount: async (): Promise<CartCount> => {
    try {
      const response = await api.get<CartCount>("/cart/count");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart count:", error);
      throw error;
    }
  },

  /**
   * Add item to cart
   * POST /cart/add
   */
  addToCart: async (payload: AddToCartPayload): Promise<Cart> => {
    try {
      const response = await api.post<Cart>("/cart/add", payload);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   * PATCH /cart/item/{productId}
   */
  updateCartItem: async (
    productId: string,
    payload: UpdateCartItemPayload,
  ): Promise<Cart> => {
    try {
      const response = await api.patch<Cart>(
        `/cart/item/${productId}`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   * DELETE /cart/item/{productId}
   */
  removeCartItem: async (productId: string): Promise<Cart> => {
    try {
      const response = await api.delete<Cart>(`/cart/item/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  },

  /**
   * Clear entire cart
   * DELETE /cart
   */
  clearCart: async (): Promise<void> => {
    try {
      await api.delete("/cart");
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  /**
   * Checkout and create order from cart
   * POST /cart/checkout
   */
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    try {
      const response = await api.post<CheckoutResponse>(
        "/cart/checkout",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  },
};

export default cartService;

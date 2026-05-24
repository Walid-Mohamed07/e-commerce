/**
 * Visitor (guest) cart stored in localStorage.
 * Used when no auth token is present. On login the items are merged
 * into the server-side cart and the visitor cart is cleared.
 */

const VISITOR_CART_KEY = "visitor_cart";

// Mirrors the shape of CartItemProduct so CartModal works without changes
export interface VisitorCartProduct {
  _id: string;
  name: string;
  price?: { price?: number; discountedPrice?: number };
  media?: {
    mainMedia?: { image?: { url?: string }; thumbnail?: { url?: string } };
    items?: Array<{ image?: { url?: string } }>;
  };
}

export interface VisitorCartItem {
  product: VisitorCartProduct;
  quantity: number;
  price: number;
}

export interface VisitorCart {
  items: VisitorCartItem[];
  totalPrice: number;
}

const computeTotal = (items: VisitorCartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const emptyCart = (): VisitorCart => ({ items: [], totalPrice: 0 });

const save = (cart: VisitorCart): void => {
  try {
    localStorage.setItem(VISITOR_CART_KEY, JSON.stringify(cart));
  } catch {
    // storage full or blocked — silently ignore
  }
};

export const visitorCartLib = {
  getCart: (): VisitorCart => {
    if (typeof window === "undefined") return emptyCart();
    try {
      const raw = localStorage.getItem(VISITOR_CART_KEY);
      if (!raw) return emptyCart();
      return JSON.parse(raw) as VisitorCart;
    } catch {
      return emptyCart();
    }
  },

  addItem: (product: VisitorCartProduct, quantity: number): VisitorCart => {
    const cart = visitorCartLib.getCart();
    const idx = cart.items.findIndex((i) => i.product._id === product._id);
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      const price =
        product.price?.discountedPrice ?? product.price?.price ?? 0;
      cart.items.push({ product, quantity, price });
    }
    cart.totalPrice = computeTotal(cart.items);
    save(cart);
    return cart;
  },

  removeItem: (productId: string): VisitorCart => {
    const cart = visitorCartLib.getCart();
    cart.items = cart.items.filter((i) => i.product._id !== productId);
    cart.totalPrice = computeTotal(cart.items);
    save(cart);
    return cart;
  },

  updateItem: (productId: string, quantity: number): VisitorCart => {
    const cart = visitorCartLib.getCart();
    const idx = cart.items.findIndex((i) => i.product._id === productId);
    if (idx >= 0) {
      if (quantity <= 0) {
        cart.items.splice(idx, 1);
      } else {
        cart.items[idx].quantity = quantity;
      }
    }
    cart.totalPrice = computeTotal(cart.items);
    save(cart);
    return cart;
  },

  clearCart: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(VISITOR_CART_KEY);
    }
  },

  getCount: (): number => visitorCartLib.getCart().items.length,
};

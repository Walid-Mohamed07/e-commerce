import { api } from "@/lib/axios";

// ─── Nested Types ──────────────────────────────────────────────────────────────

export interface OrderAddress {
  formatted?: string;
  city: string;
  country: string;
  addressLine: string;
  postalCode: string;
  subdivision?: string;
}

export interface OrderBillingInfo {
  address: OrderAddress;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  paymentMethod?: string;
  paidDate?: string;
}

export interface ShipmentPriceData {
  price?: number;
  taxIncludedInPrice?: boolean;
}

export interface ShipmentDetails {
  address: OrderAddress;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  shipmentPriceData?: ShipmentPriceData;
}

export interface OrderShippingInfo {
  deliveryOption?: string;
  estimatedDeliveryTime?: string;
  shippingRegion?: string;
  deliverByDate?: string;
  shipmentDetails?: ShipmentDetails;
}

export interface LineItemOption {
  option: string;
  selection: string;
}

export interface MediaItem {
  altText?: string;
  src?: string;
  type?: string;
}

export interface LineItemPriceData {
  price: number;
  totalPrice?: number;
  taxIncludedInPrice?: boolean;
}

export interface OrderLineItem {
  index?: number;
  productId: string;
  name: string;
  translatedName?: string;
  quantity: number;
  price: number;
  totalPrice?: number;
  lineItemType?: "PHYSICAL" | "DIGITAL";
  sku?: string;
  weight?: number;
  discount?: number;
  tax?: number;
  options?: LineItemOption[];
  mediaItem?: MediaItem;
  priceData?: LineItemPriceData;
}

export interface OrderTotals {
  subtotal: number;
  total: number;
  shipping?: number;
  tax?: number;
  discount?: number;
}

export interface OrderActivity {
  type: string;
  timestamp: string;
}

// ─── Main Order Type ───────────────────────────────────────────────────────────

export interface Order {
  _id: string;
  number: number;
  user: string | { _id: string; username: string; email: string };
  billingInfo: OrderBillingInfo;
  shippingInfo?: OrderShippingInfo;
  lineItems: OrderLineItem[];
  totals?: OrderTotals;
  fulfillmentStatus: "NOT_FULFILLED" | "FULFILLED" | "PARTIALLY_FULFILLED" | "CANCELED";
  paymentStatus: "PAID" | "NOT_PAID" | "PARTIALLY_REFUNDED" | "FULLY_REFUNDED" | "PENDING";
  currency: string;
  weightUnit: string;
  archived: boolean;
  activities?: OrderActivity[];
  createdAt: string;
  updatedAt: string;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  billingInfo: OrderBillingInfo;
  lineItems: OrderLineItem[];
  totals: {
    subtotal: number;
    total: number;
    shipping?: number;
    tax?: number;
    discount?: number;
  };
  shippingInfo?: OrderShippingInfo;
  currency?: string;
  weightUnit?: string;
  buyerLanguage?: string;
  cartId?: string;
}

export interface UpdateOrderPayload {
  fulfillmentStatus?: "NOT_FULFILLED" | "FULFILLED" | "PARTIALLY_FULFILLED" | "CANCELED";
  paymentStatus?: "PAID" | "NOT_PAID" | "PARTIALLY_REFUNDED" | "FULLY_REFUNDED" | "PENDING";
  archived?: boolean;
}

export interface GetAllOrdersResponse {
  orders: Order[];
  total: number;
}

// ─── Orders Service ────────────────────────────────────────────────────────────

export const ordersService = {
  /**
   * Create a new order (authenticated)
   * POST /orders
   */
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },

  /**
   * Get all orders for the logged-in user
   * GET /orders/my-orders
   */
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>("/orders/my-orders");
    return data;
  },

  /**
   * Get a single order by ID
   * GET /orders/:id
   */
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  /**
   * Cancel an order
   * PATCH /orders/:id/cancel
   */
  cancelOrder: async (id: string): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/cancel`);
    return data;
  },

  // ─── Admin ────────────────────────────────────────────────────────────────

  /**
   * Get all orders (admin)
   * GET /orders?page=&limit=&fulfillmentStatus=&paymentStatus=
   */
  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    fulfillmentStatus?: string;
    paymentStatus?: string;
  }): Promise<GetAllOrdersResponse> => {
    const { data } = await api.get<GetAllOrdersResponse>("/orders", { params });
    return data;
  },

  /**
   * Update order status (admin)
   * PATCH /orders/:id
   */
  updateOrder: async (id: string, payload: UpdateOrderPayload): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}`, payload);
    return data;
  },

  /**
   * Archive an order (admin)
   * PATCH /orders/:id/archive
   */
  archiveOrder: async (id: string): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/archive`);
    return data;
  },

  /**
   * Get archived orders (admin)
   * GET /orders/admin/archived
   */
  getArchivedOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>("/orders/admin/archived");
    return data;
  },
};

export default ordersService;

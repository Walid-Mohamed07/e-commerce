import { api } from "@/lib/axios";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ReviewMediaItem {
  url?: string;
  type: "image" | "video";
}

export interface Review {
  _id: string;
  productId: string;
  user: string | { _id: string; username: string; email: string };
  rating: number;
  summary: string;
  details?: string;
  media?: ReviewMediaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  orderId: string;
  rating: number;
  summary: string;
  details?: string;
  /** File objects for photos/videos */
  media?: File[];
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const reviewsService = {
  /**
   * Create a review for a product
   * POST /reviews
   */
  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const form = new FormData();
    form.append("productId", payload.productId);
    form.append("orderId", payload.orderId);
    form.append("rating", String(payload.rating));
    form.append("summary", payload.summary);
    if (payload.details) form.append("details", payload.details);
    if (payload.media) {
      payload.media.forEach((file) => form.append("media", file));
    }

    const { data } = await api.post<Review>("/reviews", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Get all reviews for a product
   * GET /reviews/product/:productId
   */
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const { data } = await api.get<Review[] | { reviews: Review[] } | { data: Review[] }>(`/reviews/product/${productId}`);
    
    // Handle different response structures
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'reviews' in data) return data.reviews;
    if (data && typeof data === 'object' && 'data' in data) return data.data;
    
    return [];
  },
};

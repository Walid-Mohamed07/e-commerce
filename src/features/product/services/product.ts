import { api } from "@/lib/axios";
import { BaseResponse } from "@/models/api";
import { Product } from "@/models/product.model";

// Accept a single payload object with optional properties
export interface GetProductsPayload {
  query?: any;
  sort?: number;
  skip?: number;
  limit?: number;
  // Add more fields as needed
}

export const getProducts = async (payload: GetProductsPayload = {}) => {
  try {
    const { data } = await api.get("/product", {
      params: payload,
    });
    console.log("Fetched products with params:", payload);
    // console.log("Fetched products:", data);

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data } = await api.get<Product>(`/product/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await api.get<Product>(`/product/slug/${slug}`);
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

import { api } from "@/lib/axios";
import { BaseResponse } from "@/models/api";
import { Category } from "@/models/category.model";

// Accept a single payload object with optional properties
export interface GetCategoriesPayload {
  query?: any;
  sort?: number;
  skip?: number;
  limit?: number;
  // Add more fields as needed
}

export const getCategories = async (payload: GetCategoriesPayload = {}) => {
  try {
    const { data } = await api.get("/category", {
      params: payload,
    });
    // console.log("Fetched category with params:", payload);
    // console.log("Fetched categories:", data);

    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const { data } = await api.get<Category>(`/category/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

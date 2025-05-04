import { Category } from "../models/Category";

// Create a new Category
export const createCategory = async (categoryData: any) => {
  const category = new Category(categoryData);
  return await category.save();
};

// Get a Category by ID
export const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

// Update a Category by ID
export const updateCategory = async (id: string, updateData: any) => {
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a Category by ID
export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};

// Get all Categories
export const getAllCategories = async () => {
  return await Category.find();
};

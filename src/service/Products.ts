import { Product } from "../models/Product";

// Create a new product
export const createProduct = async (productData: any) => {
  const product = new Product(productData);
  return await product.save();
};

// Get a product by ID
export const getProductById = async (id: string) => {
  return await Product.findById(id);
};

// Update a product by ID
export const updateProduct = async (id: string, updateData: any) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a product by ID
export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

// Get all products
export const getAllProducts = async () => {
  return await Product.find();
};

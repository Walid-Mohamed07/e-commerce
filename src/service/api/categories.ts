import { dbConnect } from "@/util/db_connection";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/service/Categories";
import type { Category } from "@/models/category.model";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      // Get a single category by ID
      try {
        const category = await getCategoryById(id as string);
        if (!category)
          return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
      } catch (error) {
        res.status(500).json({ message: "Error fetching category", error });
      }
    } else {
      // Get all products
      try {
        const products: Category[] = await getAllCategories();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
      }
    }
  } else if (req.method === "POST") {
    // Create a new category
    try {
      const category = await createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error });
    }
  } else if (req.method === "PUT") {
    // Update a category by ID
    try {
      const updatedCategory = await updateCategory(id as string, req.body);
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error });
    }
  } else if (req.method === "DELETE") {
    // Delete a category by ID
    try {
      await deleteCategory(id as string);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { dbConnect } from "@/util/db_connection";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/service/Products";
import { type Product } from "@/models/Product";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      // Get a single product by ID
      try {
        const product = await getProductById(id as string);
        if (!product)
          return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
      }
    } else {
      // Get all products
      try {
        const products: Product[] = await getAllProducts();
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
      }
    }
  } else if (req.method === "POST") {
    // Create a new product
    try {
      const product = await createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  } else if (req.method === "PUT") {
    // Update a product by ID
    try {
      const updatedProduct = await updateProduct(id as string, req.body);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  } else if (req.method === "DELETE") {
    // Delete a product by ID
    try {
      await deleteProduct(id as string);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

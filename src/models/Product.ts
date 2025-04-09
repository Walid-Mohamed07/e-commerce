import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

export const Product = models.Product || model("Product", ProductSchema);
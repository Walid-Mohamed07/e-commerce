import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  media: {
    mainMedia: {
      image: {
        url: { type: String },
        width: { type: Number },
        height: { type: Number },
      },
      video: {
        files: [
          {
            url: { type: String },
            width: { type: Number },
            height: { type: Number },
          },
        ],
        stillFrameMediaId: { type: String },
      },
      thumbnail: {
        url: { type: String },
        width: { type: Number },
        height: { type: Number },
      },
      mediaType: { type: String },
      title: { type: String },
      _id: { type: String },
    },
  },
  numberOfProducts: { type: Number },
});

export const Category = models.Category || model("Category", CategorySchema);

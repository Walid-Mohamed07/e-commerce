import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  productType: { type: String, required: true },
  categoryIds: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  weightRange: {
    minValue: { type: Number },
    maxValue: { type: Number },
  },
  stock: {
    quantity: { type: Number },
    trackInventory: { type: Boolean },
    inStock: { type: Boolean },
    inventoryStatus: { type: String },
  },
  price: {
    currency: { type: String },
    discountedPrice: { type: Number },
    price: { type: Number },
    formatted: {
      price: { type: String },
      discountedPrice: { type: String },
    },
  },
  priceData: {
    currency: { type: String },
    discountedPrice: { type: Number },
    formatted: {
      price: { type: String },
      discountedPrice: { type: String },
    },
  },
  convertedPriceData: {
    currency: { type: String },
    discountedPrice: { type: Number },
    formatted: {
      price: { type: String },
      discountedPrice: { type: String },
    },
  },
  priceRange: {
    minValue: { type: Number },
    maxValue: { type: Number },
  },
  costAndProfitData: {
    formattedItemCost: { type: String },
    profit: { type: Number },
    formattedProfit: { type: String },
    profitMargin: { type: Number },
  },
  costRange: {
    minValue: { type: Number },
    maxValue: { type: Number },
  },
  pricePerUnitData: {
    totalQuantity: { type: Number },
    totalMeasurementUnit: { type: String },
    baseQuantity: { type: Number },
    baseMeasurementUnit: { type: String },
  },
  additionalInfoSections: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
  ribbons: [
    {
      text: { type: String },
    },
  ],
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
    items: [
      {
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
    ],
  },
  customTextFields: [
    {
      title: { type: String },
      maxLength: { type: Number },
      mandatory: { type: Boolean },
    },
  ],
  productOptions: [
    {
      optionType: { type: String },
      name: { type: String },
      choices: [
        {
          value: { type: String },
          description: { type: String },
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
            items: [
              {
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
            ],
          },
          inStock: { type: Boolean },
          visible: { type: Boolean },
        },
      ],
    },
  ],
  productPageUrl: {
    base: { type: String },
    path: { type: String },
  },
  numericId: { type: String },
  inventoryItemId: { type: String },
  discount: {
    type: { type: String },
    value: { type: Number },
  },
  collectionIds: [{ type: String }],
  variants: [
    {
      _id: { type: String },
      variant: {
        priceData: {
          currency: { type: String },
          discountedPrice: { type: Number },
          formatted: {
            price: { type: String },
            discountedPrice: { type: String },
          },
        },
        convertedPriceData: {
          currency: { type: String },
          discountedPrice: { type: Number },
          formatted: {
            price: { type: String },
            discountedPrice: { type: String },
          },
        },
        costAndProfitData: {
          formattedItemCost: { type: String },
          profit: { type: Number },
          formattedProfit: { type: String },
          profitMargin: { type: Number },
        },
        weight: { type: Number },
        sku: { type: String },
        visible: { type: Boolean },
      },
      stock: {
        trackQuantity: { type: Boolean },
        inStock: { type: Boolean },
      },
    },
  ],
  seoData: {
    tags: [
      {
        type: { type: String },
        children: { type: String },
        custom: { type: Boolean },
        disabled: { type: Boolean },
      },
    ],
    settings: {
      preventAutoRedirect: { type: Boolean },
      keywords: [
        {
          term: { type: String },
          isMain: { type: Boolean },
        },
      ],
    },
  },
});

export const Product = models.Product || model("Product", ProductSchema);

const productRecord = {
  name: "Sample Product",
  slug: "sample-product",
  productType: "physical",
  weightRange: {
    minValue: 0.5,
    maxValue: 2.0,
  },
  stock: {
    trackInventory: true,
    inStock: true,
    inventoryStatus: "inStock",
  },
  price: {
    currency: "USD",
    discountedPrice: 19.99,
    formatted: {
      price: "$24.99",
      discountedPrice: "$19.99",
    },
  },
  priceData: {
    currency: "USD",
    discountedPrice: 19.99,
    formatted: {
      price: "$24.99",
      discountedPrice: "$19.99",
    },
  },
  convertedPriceData: {
    currency: "EUR",
    discountedPrice: 18.5,
    formatted: {
      price: "€23.00",
      discountedPrice: "€18.50",
    },
  },
  priceRange: {
    minValue: 15.0,
    maxValue: 25.0,
  },
  costAndProfitData: {
    formattedItemCost: "$10.00",
    profit: 9.99,
    formattedProfit: "$9.99",
    profitMargin: 50,
  },
  costRange: {
    minValue: 8.0,
    maxValue: 12.0,
  },
  pricePerUnitData: {
    totalQuantity: 10,
    totalMeasurementUnit: "kg",
    baseQuantity: 1,
    baseMeasurementUnit: "kg",
  },
  additionalInfoSections: [
    {
      title: "Short Description",
      description: "This is a short description.",
    },
    {
      title: "Description",
      description: "This is a sample product description.",
    },
  ],
  ribbons: [
    {
      text: "Best Seller",
    },
  ],
  media: {
    mainMedia: {
      image: {
        url: "https://example.com/image.jpg",
        width: 800,
        height: 600,
      },
      video: {
        files: [
          {
            url: "https://example.com/video.mp4",
            width: 1920,
            height: 1080,
          },
        ],
        stillFrameMediaId: "frame123",
      },
      thumbnail: {
        url: "https://example.com/thumbnail.jpg",
        width: 400,
        height: 300,
      },
      mediaType: "image",
      title: "Sample Media",
      _id: "media123",
    },
    items: [
      {
        image: {
          url: "https://example.com/item-image.jpg",
          width: 800,
          height: 600,
        },
        video: {
          files: [
            {
              url: "https://example.com/item-video.mp4",
              width: 1920,
              height: 1080,
            },
          ],
          stillFrameMediaId: "itemFrame123",
        },
        thumbnail: {
          url: "https://example.com/item-thumbnail.jpg",
          width: 400,
          height: 300,
        },
        mediaType: "image",
        title: "Item Media",
        _id: "itemMedia123",
      },
    ],
  },
  customTextFields: [
    {
      title: "Custom Field 1",
      maxLength: 50,
      mandatory: true,
    },
  ],
  productOptions: [
    {
      optionType: "color",
      name: "Color",
      choices: [
        {
          value: "red",
          description: "Red color option",
          media: {
            mainMedia: {
              image: {
                url: "https://example.com/red.jpg",
                width: 800,
                height: 600,
              },
              video: {
                files: [
                  {
                    url: "https://example.com/red-video.mp4",
                    width: 1920,
                    height: 1080,
                  },
                ],
                stillFrameMediaId: "redFrame123",
              },
              thumbnail: {
                url: "https://example.com/red-thumbnail.jpg",
                width: 400,
                height: 300,
              },
              mediaType: "image",
              title: "Red Media",
              _id: "redMedia123",
            },
            items: [],
          },
          inStock: true,
          visible: true,
        },
      ],
    },
  ],
  productPageUrl: {
    base: "/products",
    path: "/products/sample-product",
  },
  numericId: "12345",
  inventoryItemId: "inventory123",
  discount: {
    type: "percentage",
    value: 20,
  },
  collectionIds: ["collection123", "collection456"],
  variants: [
    {
      _id: "variant123",
      variant: {
        priceData: {
          currency: "USD",
          discountedPrice: 19.99,
          formatted: {
            price: "$24.99",
            discountedPrice: "$19.99",
          },
        },
        convertedPriceData: {
          currency: "EUR",
          discountedPrice: 18.5,
          formatted: {
            price: "€23.00",
            discountedPrice: "€18.50",
          },
        },
        costAndProfitData: {
          formattedItemCost: "$10.00",
          profit: 9.99,
          formattedProfit: "$9.99",
          profitMargin: 50,
        },
        weight: 1.5,
        sku: "SKU123",
        visible: true,
      },
      stock: {
        trackQuantity: true,
        inStock: true,
      },
    },
  ],
  seoData: {
    tags: [
      {
        type: "meta",
        children: "Sample Product",
        custom: true,
        disabled: false,
      },
    ],
    settings: {
      preventAutoRedirect: false,
      keywords: [
        {
          term: "sample",
          isMain: true,
        },
      ],
    },
  },
};

const categoryRecord = {
  name: "Electronics",
  slug: "electronics",
  media: {
    mainMedia: {
      image: {
        url: "https://example.com/electronics-main.jpg",
        width: 800,
        height: 600,
      },
      video: {
        files: [
          {
            url: "https://example.com/electronics-video.mp4",
            width: 1920,
            height: 1080,
          },
        ],
        stillFrameMediaId: "frame123",
      },
      thumbnail: {
        url: "https://example.com/electronics-thumbnail.jpg",
        width: 400,
        height: 300,
      },
      mediaType: "image",
      title: "Electronics Main Media",
      _id: "media123",
    },
    items: [
      {
        image: {
          url: "https://example.com/electronics-item1.jpg",
          width: 800,
          height: 600,
        },
        video: {
          files: [
            {
              url: "https://example.com/electronics-item1-video.mp4",
              width: 1920,
              height: 1080,
            },
          ],
          stillFrameMediaId: "itemFrame123",
        },
        thumbnail: {
          url: "https://example.com/electronics-item1-thumbnail.jpg",
          width: 400,
          height: 300,
        },
        mediaType: "image",
        title: "Electronics Item Media",
        _id: "itemMedia123",
      },
    ],
  },
  numberOfProducts: 120,
};

// // Product ----------------------------------------------------------

// {"_id":{"$oid":"680e0dc9be330171401141eb"},"name":"Shose1","slug":"shose1","productType":"physical","stock":{"trackInventory":true,"inStock":true,"inventoryStatus":"inStock","quantity":{"$numberDouble":"10.0"}},"additionalInfoSections":[{"title":"Description","description":"This is a sample product description."},{"title":"Short Description","description":"This is a short description."}],"ribbons":[{"text":"Best Seller"}],"media":{"mainMedia":{"image":{"url":"/shose1.png"},"thumbnail":{"url":"https://example.com/video.mp4"},"video":{"files":[{"url":"https://example.com/video.mp4"}]}},"items":[{"image":{"url":"/shose1.png"},"mediaType":"image","thumbnail":{"url":"/shose11.png"},"title":"Item Media","video":{"files":[{"url":""}],"stillFrameMediaId":"itemFrame123"}},{"image":{"url":"/shose11.png"}}]},"customTextFields":[{"title":"Custom Field 1","maxLength":{"$numberInt":"50"},"mandatory":true}],"productOptions":[{"optionType":"color","name":"Color","choices":[{"value":"red","description":"Red color option","media":{"mainMedia":{"image":{"url":""}},"video":{"files":[{"url":""}],"stillFrameMediaId":"redFrame123"},"mediaType":"image","thumbnail":{"url":""},"title":"Red Media"}}]}],"productPageUrl":{"base":"/products","path":"/products/shose1"},"variants":[{"_id":"variant123","variant":{"priceData":{"currency":"EGP","discountedPrice":{"$numberDouble":"19.99"},"formatted":{"price":"24.99","discountedPrice":"19.99"}},"convertedPriceData":{"currency":"USD","discountedPrice":{"$numberDouble":"18.5"},"formatted":{"price":"$22.99","discountedPrice":"$18.50"}},"costAndProfitData":{"formattedItemCost":"$10.00","profit":{"$numberDouble":"9.99"},"formattedProfit":"$9.99","profitMargin":{"$numberInt":"50"}},"sku":"SKU123","visible":true,"weight":{"$numberDouble":"1.5"}},"stock":{"trackQuantity":true,"inStock":true}}],"price":{"currency":"EGP","discountedPrice":{"$numberDouble":"19.99"},"formatted":{"price":"24.99","discountedPrice":"19.99"},"price":{"$numberDouble":"24.99"}},"priceData":{"currency":"EGP","discountedPrice":{"$numberDouble":"19.99"},"formatted":{"price":"24.99","discountedPrice":"19.99"}},"convertedPriceData":{"currency":"USD","discountedPrice":{"$numberDouble":"18.5"},"formatted":{"price":"23.00","discountedPrice":"18.50"}},"priceRange":{"minValue":{"$numberDouble":"15.0"},"maxValue":{"$numberDouble":"25.0"}},"costAndProfitData":{"formattedItemCost":"10.00","profit":{"$numberDouble":"9.99"},"formattedProfit":"9.99","profitMargin":{"$numberInt":"50"}},"costRange":{"minValue":{"$numberDouble":"8.0"},"maxValue":{"$numberDouble":"12.0"}},"pricePerUnitData":{"totalQuantity":{"$numberInt":"10"},"totalMeasurementUnit":"kg","baseQuantity":{"$numberInt":"1"},"baseMeasurementUnit":"kg"},"categoryId":{"$oid":"680e0b93be330171401141ea"}}

// // CAT ----------------------------------------------------------

// {"_id":{"$oid":"680dfae1be330171401141e7"},"name":"Fashion","slug":"fashion","media":{"mainMedia":{"image":{"url":"/cat1.png"}}},"numberOfProducts":{"$numberInt":"0"}}

// {"_id":{"$oid":"680e0b93be330171401141ea"},"name":"Accessories","slug":"accessories","media":{"mainMedia":{"image":{"url":"/cat2.webp"}}},"numberOfProducts":{"$numberInt":"0"}}

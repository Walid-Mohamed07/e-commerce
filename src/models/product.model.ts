import { Category } from "./category.model";
import { Rating } from "./rating";
import { User } from "./user.model";

export interface ProductCategoriesResponse {
  ProductsCategories: ProductsCategory[];
}

export interface ProductsCategory {
  id: number;
  name: string;
  name_ar: string;
  products_count: number;
}

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  productType: string;
  category: Category;
  weightRange?: {
    minValue?: number;
    maxValue?: number;
  };
  stock?: {
    quantity?: number;
    trackInventory?: boolean;
    inStock?: boolean;
    inventoryStatus?: string;
  };
  price?: {
    currency?: string;
    discountedPrice?: number;
    price?: number;
    formatted?: {
      price?: string;
      discountedPrice?: string;
    };
  };
  priceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: {
      price?: string;
      discountedPrice?: string;
    };
  };
  convertedPriceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: {
      price?: string;
      discountedPrice?: string;
    };
  };
  priceRange?: {
    minValue?: number;
    maxValue?: number;
  };
  costAndProfitData?: {
    formattedItemCost?: string;
    profit?: number;
    formattedProfit?: string;
    profitMargin?: number;
  };
  costRange?: {
    minValue?: number;
    maxValue?: number;
  };
  pricePerUnitData?: {
    totalQuantity?: number;
    totalMeasurementUnit?: string;
    baseQuantity?: number;
    baseMeasurementUnit?: string;
  };
  additionalInfoSections?: Array<{
    title?: string;
    description?: string;
  }>;
  ribbons?: Array<{
    text?: string;
  }>;
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
        width?: number;
        height?: number;
      };
      video?: {
        files?: Array<{
          url?: string;
          width?: number;
          height?: number;
        }>;
        stillFrameMediaId?: string;
      };
      thumbnail?: {
        url?: string;
        width?: number;
        height?: number;
      };
      mediaType?: string;
      title?: string;
      _id?: string;
    };
    items?: Array<{
      image?: {
        url?: string;
        width?: number;
        height?: number;
      };
      video?: {
        files?: Array<{
          url?: string;
          width?: number;
          height?: number;
        }>;
        stillFrameMediaId?: string;
      };
      thumbnail?: {
        url?: string;
        width?: number;
        height?: number;
      };
      mediaType?: string;
      title?: string;
      _id?: string;
    }>;
  };
  customTextFields?: Array<{
    title?: string;
    maxLength?: number;
    mandatory?: boolean;
  }>;
  productOptions?: Array<{
    optionType?: string;
    name?: string;
    choices?: Array<{
      value?: string;
      description?: string;
      media?: {
        mainMedia?: {
          image?: {
            url?: string;
            width?: number;
            height?: number;
          };
          video?: {
            files?: Array<{
              url?: string;
              width?: number;
              height?: number;
            }>;
            stillFrameMediaId?: string;
          };
          thumbnail?: {
            url?: string;
            width?: number;
            height?: number;
          };
          mediaType?: string;
          title?: string;
          _id?: string;
        };
        items?: Array<{
          image?: {
            url?: string;
            width?: number;
            height?: number;
          };
          video?: {
            files?: Array<{
              url?: string;
              width?: number;
              height?: number;
            }>;
            stillFrameMediaId?: string;
          };
          thumbnail?: {
            url?: string;
            width?: number;
            height?: number;
          };
          mediaType?: string;
          title?: string;
          _id?: string;
        }>;
      };
      inStock?: boolean;
      visible?: boolean;
    }>;
  }>;
  productPageUrl?: {
    base?: string;
    path?: string;
  };
  numericId?: string;
  inventoryItemId?: string;
  discount?: {
    type?: string;
    value?: number;
  };
  collectionIds?: string[];
  variants?: Array<{
    _id?: string;
    variant?: {
      priceData?: {
        currency?: string;
        discountedPrice?: number;
        formatted?: {
          price?: string;
          discountedPrice?: string;
        };
      };
      convertedPriceData?: {
        currency?: string;
        discountedPrice?: number;
        formatted?: {
          price?: string;
          discountedPrice?: string;
        };
      };
      costAndProfitData?: {
        formattedItemCost?: string;
        profit?: number;
        formattedProfit?: string;
        profitMargin?: number;
      };
      weight?: number;
      sku?: string;
      visible?: boolean;
    };
    stock?: {
      trackQuantity?: boolean;
      inStock?: boolean;
    };
  }>;
  seoData?: {
    tags?: Array<{
      type?: string;
      children?: string;
      custom?: boolean;
      disabled?: boolean;
    }>;
    settings?: {
      preventAutoRedirect?: boolean;
      keywords?: Array<{
        term?: string;
        isMain?: boolean;
      }>;
    };
  };
}

export interface ProductResponse {
  product: Product;
  rating: Rating;
  user: User;
  likedByAuth: boolean;
  //   relatedBlogs: RelatedWork[];
}

export interface ProductsResponse {
  products: {
    data: Product[];
    total: number;
    last_page: number;
  };
}

export interface MostSeenProductResponse {
  blogsBySeen: {
    data: Product[];
    total: number;
  };
}

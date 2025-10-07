import { Category } from "./category.model";
import { Rating } from "./rating";
import { User } from "./user.model";

// --- Nested Types ---
export interface ProductMediaItem {
  image?: { url?: string; width?: number; height?: number };
  video?: {
    files?: Array<{ url?: string; width?: number; height?: number }>;
    stillFrameMediaId?: string;
  };
  thumbnail?: { url?: string; width?: number; height?: number };
  mediaType?: string;
  title?: string;
  _id?: string;
}

export interface Media {
  /** Primary media (image, video etc) associated with this product. */
  mainMedia?: MediaItem;
  /** Media (images, videos etc) associated with this product. */
  items?: MediaItem[];
}

export interface MediaItem extends MediaItemItemOneOf {
  /** Image data (URL, size). */
  image?: MediaItemUrlAndSize;
  /** Video data (URL, size). */
  video?: MediaItemVideo;
  /** Media item thumbnail details. */
  thumbnail?: MediaItemUrlAndSize;
  /** Media item type (image, video, etc.). */
  mediaType?: MediaItemType;
  /** Media item title. */
  title?: string;
  /** Media ID (for example, `"nsplsh_306d666a123a4a74306459~mv2_d_4517_2992_s_4_2.jpg"`). */
  _id?: string;
}
/** @oneof */
export interface MediaItemItemOneOf {
  /** Image data (URL, size). */
  image?: MediaItemUrlAndSize;
  /** Video data (URL, size). */
  video?: MediaItemVideo;
}
export interface MediaItemUrlAndSize {
  /** Media item URL. */
  url?: string;
  /** Media item width. */
  width?: number;
  /** Media item height. */
  height?: number;
  /** Media format (mp4, png, etc.). */
  format?: string | null;
  /** Alt text. This text will be shown in case the image is not available. */
  altText?: string | null;
}
export declare enum MediaItemType {
  unspecified_media_item_type = "unspecified_media_item_type",
  image = "image",
  video = "video",
  audio = "audio",
  document = "document",
  zip = "zip",
}
export interface MediaItemVideo {
  /** Data (URL, size) about each resolution for which this video is available. */
  files?: MediaItemUrlAndSize[];
  /** ID of an image taken from the video. Used primarily for Wix Search indexing. For example, `"nsplsh_306d666a123a4a74306459~mv2_d_4517_2992_s_4_2.jpg"`. */
  stillFrameMediaId?: string;
}

export interface ProductOptionChoice {
  /** Choice value. */
  value?: string;
  /** Choice description. */
  description?: string;
  /**
   * Media items (images, videos) associated with this choice
   * @readonly
   */
  media?: Media;
  /**
   * Based on the customer’s choices, which (if any) variants that include the selected choices are in stock
   * @readonly
   */
  inStock?: boolean;
  /**
   * Based on the customer’s choices, which (if any) variants that include the selected choices are visible
   * @readonly
   */
  visible?: boolean;
}

export interface ProductOption {
  optionType?: string;
  name?: string;
  choices?: ProductOptionChoice[];
}

export interface ProductVariantData {
  priceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: { price?: string; discountedPrice?: string };
  };
  convertedPriceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: { price?: string; discountedPrice?: string };
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
}

export interface ProductVariant {
  _id?: string;
  variant?: ProductVariantData;
  stock?: {
    /** Whether inventory is being tracked. */
    trackQuantity?: boolean;
    /** Quantity currently left in inventory. */
    quantity?: number | null;
    /** Whether the product is currently in stock (relevant only when tracking manually). */
    inStock?: boolean;
  };
  /** Specific choices within a selection, as option-choice key-value pairs */
  choices?: Record<string, string>;
}

export interface ProductAdditionalInfoSection {
  title?: string;
  description?: string;
}

export interface ProductRibbon {
  text?: string;
}

export interface ProductCustomTextField {
  title?: string;
  maxLength?: number;
  mandatory?: boolean;
}

/**
 * The SEO schema object contains data about different types of meta tags. It makes sure that the information about your page is presented properly to search engines.
 * The search engines use this information for ranking purposes, or to display snippets in the search results.
 * This data will override other sources of tags (for example patterns) and will be included in the <head> section of the HTML document, while not being displayed on the page itself.
 */
export interface SeoSchema {
  /** SEO tag information. */
  tags?: Tag[];
  /** SEO general settings. */
  settings?: Settings;
}

export interface Keyword {
  /** Keyword value. */
  term?: string;
  /** Whether the keyword is the main focus keyword. */
  isMain?: boolean;
}
export interface Tag {
  /**
   * SEO tag type.
   *
   *
   * Supported values: `title`, `meta`, `script`, `link`.
   */
  type?: string;
  /**
   * A `{'key':'value'}` pair object where each SEO tag property (`'name'`, `'content'`, `'rel'`, `'href'`) contains a value.
   * For example: `{'name': 'description', 'content': 'the description itself'}`.
   */
  props?: Record<string, any> | null;
  /** SEO tag meta data. For example, `{height: 300, width: 240}`. */
  meta?: Record<string, any> | null;
  /** SEO tag inner content. For example, `<title> inner content </title>`. */
  children?: string;
  /** Whether the tag is a custom tag. */
  custom?: boolean;
  /** Whether the tag is disabled. */
  disabled?: boolean;
}
export interface Settings {
  /**
   * Whether the Auto Redirect feature, which creates `301 redirects` on a slug change, is enabled.
   *
   *
   * Default: `false` (Auto Redirect is enabled.)
   */
  preventAutoRedirect?: boolean;
  /** User-selected keyword terms for a specific page. */
  keywords?: Keyword[];
}

interface QueryOffsetResult {
  currentPage: number | undefined;
  totalPages: number | undefined;
  totalCount: number | undefined;
  hasNext: () => boolean;
  hasPrev: () => boolean;
  length: number;
  pageSize: number;
}
export interface ProductsQueryResult extends QueryOffsetResult {
  items: Product[];
  next: () => Promise<ProductsQueryResult>;
  prev: () => Promise<ProductsQueryResult>;
}

export declare enum InventoryStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  PARTIALLY_OUT_OF_STOCK = "PARTIALLY_OUT_OF_STOCK",
}

// --- Main Product Type ---
export interface Product {
  _id?: string;
  name: string;
  slug: string;
  productType: string;
  category: Category;
  weightRange?: { minValue?: number; maxValue?: number };
  stock?: {
    quantity?: number;
    trackInventory?: boolean;
    inStock?: boolean;
    inventoryStatus?: InventoryStatus;
  };
  price?: {
    currency?: string;
    discountedPrice?: number;
    price?: number;
    formatted?: { price?: string; discountedPrice?: string };
  };
  priceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: { price?: string; discountedPrice?: string };
  };
  convertedPriceData?: {
    currency?: string;
    discountedPrice?: number;
    formatted?: { price?: string; discountedPrice?: string };
  };
  priceRange?: { minValue?: number; maxValue?: number };
  costAndProfitData?: {
    formattedItemCost?: string;
    profit?: number;
    formattedProfit?: string;
    profitMargin?: number;
  };
  costRange?: { minValue?: number; maxValue?: number };
  pricePerUnitData?: {
    totalQuantity?: number;
    totalMeasurementUnit?: string;
    baseQuantity?: number;
    baseMeasurementUnit?: string;
  };
  additionalInfoSections?: ProductAdditionalInfoSection[];
  ribbons?: ProductRibbon[];
  media?: Media;
  customTextFields?: ProductCustomTextField[];
  productOptions?: ProductOption[];
  productPageUrl?: { base?: string; path?: string };
  numericId?: string;
  inventoryItemId?: string;
  discount?: { type?: string; value?: number };
  collectionIds?: string[];
  variants?: ProductVariant[];
  /** Custom SEO data for the product. */
  seoData?: SeoSchema;
}

// --- Response Types ---
export interface ProductCategoriesResponse {
  ProductsCategories: ProductsCategory[];
}

export interface ProductsCategory {
  id: number;
  name: string;
  name_ar: string;
  products_count: number;
}

export interface ProductResponse {
  product: Product;
  rating: Rating;
  user: User;
  likedByAuth: boolean;
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

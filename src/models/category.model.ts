import { User } from "./user.model";

export interface AllCategories {
  category: Category[];
}

export interface Category {
  name: string;
  slug: string;
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
  };
  creator?: User;
  numberOfProducts?: number;
}

export interface CategoryResponse {
  category: Category;
  creator: User;
}

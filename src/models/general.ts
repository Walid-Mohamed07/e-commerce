export type Language = "en" | "ar";

export interface GeneralParams {
  query?: string;
  sort?: number;
  limit?: number;
  skip?: number;
  category?: number;
  page?: number;
  lang?: Language;
  user?: number;
}

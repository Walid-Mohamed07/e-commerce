export interface Comments {
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    profilePicture: string;
  };
}

export interface CreateCommentPayload {
  product_id?: number;
  report_id?: number;
  content: string;
}

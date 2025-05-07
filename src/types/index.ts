export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  category_id: string;
  file_path: string;
  cover_image: string;
  author: string;
  publication_year: number;
  page_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  username: string;
  book_id: string;
  comment_text: string;
  rating: number;
  is_validated: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  book_id: string;
  note_text: string;
  page_number: number;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  last_read: string;
}
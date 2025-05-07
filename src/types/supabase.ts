export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          is_admin: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          is_admin?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          is_admin?: boolean | null
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          file_path: string | null
          cover_image: string | null
          author: string
          publication_year: number | null
          page_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category_id?: string | null
          file_path?: string | null
          cover_image?: string | null
          author: string
          publication_year?: number | null
          page_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          file_path?: string | null
          cover_image?: string | null
          author?: string
          publication_year?: number | null
          page_count?: number | null
          created_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string | null
          book_id: string | null
          comment_text: string
          rating: number | null
          is_validated: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          comment_text: string
          rating?: number | null
          is_validated?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          comment_text?: string
          rating?: number | null
          is_validated?: boolean | null
          created_at?: string | null
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string | null
          book_id: string | null
          note_text: string
          page_number: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          note_text: string
          page_number: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          note_text?: string
          page_number?: number
          created_at?: string | null
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string | null
          book_id: string | null
          current_page: number
          last_read: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          current_page: number
          last_read?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          book_id?: string | null
          current_page?: number
          last_read?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
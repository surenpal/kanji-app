export type Database = {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          kanji_index: number;
          studied_at: string;
          quiz_correct: number;
          quiz_attempted: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          kanji_index: number;
          studied_at?: string;
          quiz_correct?: number;
          quiz_attempted?: number;
        };
        Update: {
          studied_at?: string;
          quiz_correct?: number;
          quiz_attempted?: number;
        };
        Relationships: [];
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          kanji_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kanji_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kanji_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

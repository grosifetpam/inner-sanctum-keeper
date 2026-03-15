export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alter_relations: {
        Row: {
          created_at: string
          from_alter_id: string
          id: string
          to_alter_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_alter_id: string
          id?: string
          to_alter_id: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_alter_id?: string
          id?: string
          to_alter_id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      alters: {
        Row: {
          apparent_age: string | null
          avatar: string | null
          created_at: string
          difficulties: string
          id: string
          internal_notes: string
          is_public: boolean
          name: string
          personality: string
          pronouns: string
          relations: string
          role: string
          role_type: string
          strengths: string
          user_id: string
        }
        Insert: {
          apparent_age?: string | null
          avatar?: string | null
          created_at?: string
          difficulties?: string
          id?: string
          internal_notes?: string
          is_public?: boolean
          name: string
          personality?: string
          pronouns?: string
          relations?: string
          role?: string
          role_type?: string
          strengths?: string
          user_id: string
        }
        Update: {
          apparent_age?: string | null
          avatar?: string | null
          created_at?: string
          difficulties?: string
          id?: string
          internal_notes?: string
          is_public?: boolean
          name?: string
          personality?: string
          pronouns?: string
          relations?: string
          role?: string
          role_type?: string
          strengths?: string
          user_id?: string
        }
        Relationships: []
      }
      citations: {
        Row: {
          alter_id: string
          created_at: string
          date: string
          id: string
          is_public: boolean
          text: string
          user_id: string
        }
        Insert: {
          alter_id: string
          created_at?: string
          date: string
          id?: string
          is_public?: boolean
          text: string
          user_id: string
        }
        Update: {
          alter_id?: string
          created_at?: string
          date?: string
          id?: string
          is_public?: boolean
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      exercise_completions: {
        Row: {
          completed_at: string
          exercise_id: string
          id: string
          notes: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          exercise_id: string
          id?: string
          notes?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          exercise_id?: string
          id?: string
          notes?: string
          user_id?: string
        }
        Relationships: []
      }
      front_entries: {
        Row: {
          alter_id: string
          created_at: string
          id: string
          notes: string
          timestamp: string
          user_id: string
        }
        Insert: {
          alter_id: string
          created_at?: string
          id?: string
          notes?: string
          timestamp: string
          user_id: string
        }
        Update: {
          alter_id?: string
          created_at?: string
          id?: string
          notes?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      inner_world_places: {
        Row: {
          created_at: string
          description: string
          id: string
          image: string | null
          is_public: boolean
          linked_alter_ids: string[]
          name: string
          significance: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          is_public?: boolean
          linked_alter_ids?: string[]
          name: string
          significance?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image?: string | null
          is_public?: boolean
          linked_alter_ids?: string[]
          name?: string
          significance?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          alter_id: string
          content: string
          created_at: string
          date: string
          id: string
          is_private_alter_journal: boolean
          is_public: boolean
          tags: string[]
          title: string
          user_id: string
        }
        Insert: {
          alter_id: string
          content?: string
          created_at?: string
          date: string
          id?: string
          is_private_alter_journal?: boolean
          is_public?: boolean
          tags?: string[]
          title?: string
          user_id: string
        }
        Update: {
          alter_id?: string
          content?: string
          created_at?: string
          date?: string
          id?: string
          is_private_alter_journal?: boolean
          is_public?: boolean
          tags?: string[]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      lexicon_entries: {
        Row: {
          category: string
          created_at: string
          definition: string
          id: string
          is_public: boolean
          term: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          definition?: string
          id?: string
          is_public?: boolean
          term: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          definition?: string
          id?: string
          is_public?: boolean
          term?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          alter_id: string
          created_at: string
          date: string
          energy_level: number
          id: string
          mood: string
          notes: string
          user_id: string
        }
        Insert: {
          alter_id: string
          created_at?: string
          date: string
          energy_level?: number
          id?: string
          mood?: string
          notes?: string
          user_id: string
        }
        Update: {
          alter_id?: string
          created_at?: string
          date?: string
          energy_level?: number
          id?: string
          mood?: string
          notes?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_public: boolean
          link: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_public?: boolean
          link?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_public?: boolean
          link?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      system_info: {
        Row: {
          created_at: string
          current_front_alter_id: string
          description: string
          homepage_image: string | null
          id: string
          mood_of_day: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_front_alter_id?: string
          description?: string
          homepage_image?: string | null
          id?: string
          mood_of_day?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_front_alter_id?: string
          description?: string
          homepage_image?: string | null
          id?: string
          mood_of_day?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_rules: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_public: boolean
          sort_order: number
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          sort_order?: number
          title?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          sort_order?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          alter_id: string
          created_at: string
          date: string
          description: string
          id: string
          is_public: boolean
          title: string
          user_id: string
        }
        Insert: {
          alter_id: string
          created_at?: string
          date: string
          description?: string
          id?: string
          is_public?: boolean
          title?: string
          user_id: string
        }
        Update: {
          alter_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_public?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

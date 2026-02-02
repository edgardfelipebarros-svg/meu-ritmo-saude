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
      achievements: {
        Row: {
          description: string | null
          icon_name: string | null
          id: string
          points: number | null
          title: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          icon_name?: string | null
          id?: string
          points?: number | null
          title: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          icon_name?: string | null
          id?: string
          points?: number | null
          title?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          description: string | null
          icon_name: string | null
          id: string
          name: string
          points: number | null
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          points?: number | null
          requirement_type: string
          requirement_value: number
        }
        Update: {
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          points?: number | null
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          event_type: string
          exercise_id: string | null
          id: string
          is_completed: boolean | null
          recipe_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          event_type: string
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          recipe_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          recipe_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          image_urls: string[] | null
          message_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          message_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_urls?: string[] | null
          message_type?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          benefits: string | null
          calories_burned: number | null
          contraindications: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration: number | null
          equipment_needed: string[] | null
          id: string
          image_urls: string[] | null
          instructions: string | null
          module_type: string | null
          muscle_groups: string[] | null
          observations: string | null
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          benefits?: string | null
          calories_burned?: number | null
          contraindications?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_urls?: string[] | null
          instructions?: string | null
          module_type?: string | null
          muscle_groups?: string[] | null
          observations?: string | null
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          benefits?: string | null
          calories_burned?: number | null
          contraindications?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_urls?: string[] | null
          instructions?: string | null
          module_type?: string | null
          muscle_groups?: string[] | null
          observations?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          diet_preference: string | null
          email: string | null
          fitness_level: string | null
          full_name: string | null
          goal: string | null
          height: number | null
          id: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          diet_preference?: string | null
          email?: string | null
          fitness_level?: string | null
          full_name?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          diet_preference?: string | null
          email?: string | null
          fitness_level?: string | null
          full_name?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories_per_serving: number | null
          cook_time: number | null
          created_at: string
          description: string | null
          diet_type: string | null
          difficulty: string | null
          goal_category: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          instructions: string[] | null
          nutritional_info: Json | null
          prep_time: number | null
          servings: number | null
          title: string
          updated_at: string
        }
        Insert: {
          calories_per_serving?: number | null
          cook_time?: number | null
          created_at?: string
          description?: string | null
          diet_type?: string | null
          difficulty?: string | null
          goal_category?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          nutritional_info?: Json | null
          prep_time?: number | null
          servings?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          calories_per_serving?: number | null
          cook_time?: number | null
          created_at?: string
          description?: string | null
          diet_type?: string | null
          difficulty?: string | null
          goal_category?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          nutritional_info?: Json | null
          prep_time?: number | null
          servings?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopping_list: {
        Row: {
          created_at: string
          id: string
          ingredient: string
          is_checked: boolean | null
          quantity: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient: string
          is_checked?: boolean | null
          quantity?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient?: string
          is_checked?: boolean | null
          quantity?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_exercises: {
        Row: {
          calories_burned: number | null
          completed_at: string
          duration: number | null
          exercise_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string
          duration?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string
          duration?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed: boolean | null
          created_at: string
          current_value: number | null
          goal_type: string
          id: string
          target_value: number
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          current_value?: number | null
          goal_type: string
          id?: string
          target_value: number
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          current_value?: number | null
          goal_type?: string
          id?: string
          target_value?: number
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          created_at: string
          current_value: number | null
          id: string
          is_completed: boolean | null
          mission_id: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          mission_id: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          mission_id?: string
          user_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "weekly_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string
          current_level: number | null
          id: string
          last_activity_date: string | null
          streak_days: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number | null
          id?: string
          last_activity_date?: string | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number | null
          id?: string
          last_activity_date?: string | null
          streak_days?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_recipes: {
        Row: {
          created_at: string
          id: string
          in_shopping_list: boolean | null
          is_favorite: boolean | null
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          in_shopping_list?: boolean | null
          is_favorite?: boolean | null
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          in_shopping_list?: boolean | null
          is_favorite?: boolean | null
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_weight_history: {
        Row: {
          id: string
          recorded_at: string
          user_id: string
          weight: number
        }
        Insert: {
          id?: string
          recorded_at?: string
          user_id: string
          weight: number
        }
        Update: {
          id?: string
          recorded_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      weekly_missions: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          mission_type: string
          points_reward: number | null
          target_value: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          mission_type: string
          points_reward?: number | null
          target_value: number
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          mission_type?: string
          points_reward?: number | null
          target_value?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

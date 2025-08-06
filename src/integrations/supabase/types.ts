export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          points: number | null
          title: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          points?: number | null
          title: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          created_at?: string
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
      chat_messages: {
        Row: {
          content: string
          context_data: Json | null
          created_at: string
          id: string
          image_urls: string[] | null
          message_type: string
          user_id: string
        }
        Insert: {
          content: string
          context_data?: Json | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          message_type: string
          user_id: string
        }
        Update: {
          content?: string
          context_data?: Json | null
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
          difficulty_level: string
          duration: number | null
          equipment_needed: string[] | null
          id: string
          image_urls: string[] | null
          instructions: string | null
          module_type: string
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
          difficulty_level: string
          duration?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_urls?: string[] | null
          instructions?: string | null
          module_type: string
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
          difficulty_level?: string
          duration?: number | null
          equipment_needed?: string[] | null
          id?: string
          image_urls?: string[] | null
          instructions?: string | null
          module_type?: string
          muscle_groups?: string[] | null
          observations?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          calories: number | null
          completed: boolean | null
          created_at: string
          custom_meal: string | null
          date: string
          id: string
          meal_type: string
          notes: string | null
          recipe_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          completed?: boolean | null
          created_at?: string
          custom_meal?: string | null
          date: string
          id?: string
          meal_type: string
          notes?: string | null
          recipe_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          completed?: boolean | null
          created_at?: string
          custom_meal?: string | null
          date?: string
          id?: string
          meal_type?: string
          notes?: string | null
          recipe_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
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
      progress: {
        Row: {
          body_fat_percentage: number | null
          created_at: string
          id: string
          measurement_date: string
          measurements: Json | null
          muscle_mass: number | null
          notes: string | null
          photos: string[] | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurement_date: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: string[] | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurement_date?: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: string[] | null
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
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          current_value: number | null
          goal_type: string
          id: string
          target_value: number | null
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          goal_type: string
          id?: string
          target_value?: number | null
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          goal_type?: string
          id?: string
          target_value?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed_date: string | null
          created_at: string
          difficulty_rating: number | null
          duration_minutes: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          reps_completed: number | null
          scheduled_date: string | null
          sets_completed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          completed_date?: string | null
          created_at?: string
          difficulty_rating?: number | null
          duration_minutes?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps_completed?: number | null
          scheduled_date?: string | null
          sets_completed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          completed_date?: string | null
          created_at?: string
          difficulty_rating?: number | null
          duration_minutes?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps_completed?: number | null
          scheduled_date?: string | null
          sets_completed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
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

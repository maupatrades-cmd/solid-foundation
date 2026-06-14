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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          agency_history: string | null
          avatar_url: string | null
          best_call_time: string | null
          biggest_challenge: string | null
          business_address: string | null
          business_city: string | null
          business_name: string | null
          business_province: string | null
          city: string | null
          competitor_envy: string | null
          created_at: string
          current_marketing_assets: string[] | null
          email: string | null
          first_name: string | null
          founder_inspiration: string | null
          full_name: string | null
          id: string
          industry: string | null
          last_name: string | null
          mobile_number: string | null
          monthly_marketing_budget: string | null
          monthly_revenue_range: string | null
          new_customers_target: string | null
          number_of_employees: string | null
          onboarding_step: number | null
          popia_consent: boolean | null
          preferred_contact_channels: string[] | null
          province: string | null
          signed_up_by: string | null
          street_address: string | null
          terms_agreed: boolean | null
          twelve_month_goal: string | null
          updated_at: string
          urgency_level: string | null
          wants_consultation_call: boolean | null
          wants_personalized_proposal: boolean | null
          years_in_business: string | null
        }
        Insert: {
          agency_history?: string | null
          avatar_url?: string | null
          best_call_time?: string | null
          biggest_challenge?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_province?: string | null
          city?: string | null
          competitor_envy?: string | null
          created_at?: string
          current_marketing_assets?: string[] | null
          email?: string | null
          first_name?: string | null
          founder_inspiration?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          last_name?: string | null
          mobile_number?: string | null
          monthly_marketing_budget?: string | null
          monthly_revenue_range?: string | null
          new_customers_target?: string | null
          number_of_employees?: string | null
          onboarding_step?: number | null
          popia_consent?: boolean | null
          preferred_contact_channels?: string[] | null
          province?: string | null
          signed_up_by?: string | null
          street_address?: string | null
          terms_agreed?: boolean | null
          twelve_month_goal?: string | null
          updated_at?: string
          urgency_level?: string | null
          wants_consultation_call?: boolean | null
          wants_personalized_proposal?: boolean | null
          years_in_business?: string | null
        }
        Update: {
          agency_history?: string | null
          avatar_url?: string | null
          best_call_time?: string | null
          biggest_challenge?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_province?: string | null
          city?: string | null
          competitor_envy?: string | null
          created_at?: string
          current_marketing_assets?: string[] | null
          email?: string | null
          first_name?: string | null
          founder_inspiration?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          mobile_number?: string | null
          monthly_marketing_budget?: string | null
          monthly_revenue_range?: string | null
          new_customers_target?: string | null
          number_of_employees?: string | null
          onboarding_step?: number | null
          popia_consent?: boolean | null
          preferred_contact_channels?: string[] | null
          province?: string | null
          signed_up_by?: string | null
          street_address?: string | null
          terms_agreed?: boolean | null
          twelve_month_goal?: string | null
          updated_at?: string
          urgency_level?: string | null
          wants_consultation_call?: boolean | null
          wants_personalized_proposal?: boolean | null
          years_in_business?: string | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "head_of_tech"
        | "field_agent"
        | "cpc"
        | "client"
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
      app_role: [
        "owner",
        "admin",
        "head_of_tech",
        "field_agent",
        "cpc",
        "client",
      ],
    },
  },
} as const

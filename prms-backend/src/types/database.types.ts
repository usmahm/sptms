export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bus_nodes: {
        Row: {
          code: string | null;
          created_at: string;
          id: string;
          location: Json | null;
          name: string | null;
          status: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          id?: string;
          location?: Json | null;
          name?: string | null;
          status?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          id?: string;
          location?: Json | null;
          name?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      bus_stops: {
        Row: {
          code: string | null;
          created_at: string;
          geo_fence: string | null;
          id: string;
          location: Json | null;
          name: string | null;
          status: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          geo_fence?: string | null;
          id?: string;
          location?: Json | null;
          name?: string | null;
          status?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          geo_fence?: string | null;
          id?: string;
          location?: Json | null;
          name?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bus_stops_geo_fence_fkey";
            columns: ["geo_fence"];
            isOneToOne: false;
            referencedRelation: "geo_fences";
            referencedColumns: ["id"];
          }
        ];
      };
      geo_fences: {
        Row: {
          bound: Json | null;
          created_at: string;
          id: string;
          name: string | null;
          status: string | null;
          type: string | null;
        };
        Insert: {
          bound?: Json | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          status?: string | null;
          type?: string | null;
        };
        Update: {
          bound?: Json | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          status?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          bus_id: string | null;
          created_at: string;
          id: number;
          payload: Json | null;
          read: boolean;
          trip_id: string | null;
          type: string | null;
        };
        Insert: {
          bus_id?: string | null;
          created_at?: string;
          id?: number;
          payload?: Json | null;
          read?: boolean;
          trip_id?: string | null;
          type?: string | null;
        };
        Update: {
          bus_id?: string | null;
          created_at?: string;
          id?: number;
          payload?: Json | null;
          read?: boolean;
          trip_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notification_bus_id_fkey";
            columns: ["bus_id"];
            isOneToOne: false;
            referencedRelation: "bus_nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notification_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          }
        ];
      };
      routes: {
        Row: {
          code: string | null;
          created_at: string;
          distance: number | null;
          duration: number | null;
          end_bus_stop: string | null;
          expected_path: Json | null;
          geo_fence: string | null;
          id: string;
          name: string | null;
          start_bus_stop: string | null;
          status: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          distance?: number | null;
          duration?: number | null;
          end_bus_stop?: string | null;
          expected_path?: Json | null;
          geo_fence?: string | null;
          id?: string;
          name?: string | null;
          start_bus_stop?: string | null;
          status?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          distance?: number | null;
          duration?: number | null;
          end_bus_stop?: string | null;
          expected_path?: Json | null;
          geo_fence?: string | null;
          id?: string;
          name?: string | null;
          start_bus_stop?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "routes_end_bus_stop_fkey";
            columns: ["end_bus_stop"];
            isOneToOne: false;
            referencedRelation: "bus_stops";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "routes_geo_fence_fkey";
            columns: ["geo_fence"];
            isOneToOne: false;
            referencedRelation: "geo_fences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "routes_start_bus_stop_fkey";
            columns: ["start_bus_stop"];
            isOneToOne: false;
            referencedRelation: "bus_stops";
            referencedColumns: ["id"];
          }
        ];
      };
      trips: {
        Row: {
          actual_arrival_time: string | null;
          actual_departure_time: string | null;
          actual_path: Json | null;
          bus: string | null;
          created_at: string;
          id: string;
          route: string | null;
          scheduled_arrival_time: string | null;
          scheduled_departure_time: string | null;
        };
        Insert: {
          actual_arrival_time?: string | null;
          actual_departure_time?: string | null;
          actual_path?: Json | null;
          bus?: string | null;
          created_at?: string;
          id?: string;
          route?: string | null;
          scheduled_arrival_time?: string | null;
          scheduled_departure_time?: string | null;
        };
        Update: {
          actual_arrival_time?: string | null;
          actual_departure_time?: string | null;
          actual_path?: Json | null;
          bus?: string | null;
          created_at?: string;
          id?: string;
          route?: string | null;
          scheduled_arrival_time?: string | null;
          scheduled_departure_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trips_bus_fkey";
            columns: ["bus"];
            isOneToOne: false;
            referencedRelation: "bus_nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trips_route_fkey";
            columns: ["route"];
            isOneToOne: false;
            referencedRelation: "routes";
            referencedColumns: ["id"];
          }
        ];
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {}
  }
} as const;

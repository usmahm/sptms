import { createClient } from "@supabase/supabase-js";
import config from "./config";
import { Database } from "../types/database.types";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_KEY
);

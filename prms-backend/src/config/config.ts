import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  FRONTEND_ORIGIN: string;
}

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN!
};

export default config;

import { createClient } from "@supabase/supabase-js";

// Uses Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ozbkbjddpdxumofrqbyd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96YmtiamRkcGR4dW1vZnJxYnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDQzNTMsImV4cCI6MjA4OTIyMDM1M30.EsJuXBaIslxoqlcFN1KDROw83P8_BkO9js3JEvrd_jI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

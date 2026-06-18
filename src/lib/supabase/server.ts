import "server-only";

import { createClient } from "@supabase/supabase-js";

function readEnv(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }

  throw new Error(`Missing environment variable. Expected one of: ${names.join(", ")}`);
}

function supabaseUrl(): string {
  return readEnv(["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]);
}

function supabaseOptions() {
  return {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  };
}

export function createRestrictedSupabaseClient() {
  return createClient(
    supabaseUrl(),
    readEnv(["SUPABASE_RESTRICTED_KEY", "SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]),
    supabaseOptions(),
  );
}

export function createServiceSupabaseClient() {
  return createClient(
    supabaseUrl(),
    readEnv(["SUPABASE_SERVICE_ROLE_KEY"]),
    supabaseOptions(),
  );
}

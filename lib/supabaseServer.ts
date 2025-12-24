import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // In serverless environments it's okay to not initialize until used.
}

export const supabaseServer = () => {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase server configuration missing. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in env."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};

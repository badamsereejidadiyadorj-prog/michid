import { supabaseServer } from "../lib/supabaseServer.js";

async function run() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  try {
    const sb = supabaseServer();
    // Create user via admin API
    // Note: requires SUPABASE_SERVICE_ROLE_KEY in env
    const res = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    console.log("created admin user:", res);
  } catch (err) {
    console.error("failed to create admin", err);
  }
}

run();

import { supabaseServer } from "../lib/supabaseServer.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  try {
    const sb = supabaseServer();

    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    console.log("✅ created admin user:", data);
  } catch (err) {
    console.error("❌ failed to create admin", err);
    process.exit(1);
  }
}

run();

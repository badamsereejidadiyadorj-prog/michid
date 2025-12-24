import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sb = supabaseServer();

    if (req.method === "GET") {
      const { data, error } = await sb.from("site_settings").select("*");
      if (error) throw error;
      // return as object keyed by key
      const obj: Record<string, any> = {};
      (data || []).forEach((r: any) => {
        obj[r.key] = r.value;
      });
      return res.status(200).json(obj);
    }

    if (req.method === "POST") {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: "key required" });
      const payload = { key, value };
      const { data, error } = await sb
        .from("site_settings")
        .upsert([payload], { onConflict: "key" })
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
}

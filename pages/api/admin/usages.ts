import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sb = supabaseServer();
    if (req.method === "GET") {
      const { data, error } = await sb.from("usages").select("*");
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { key, label } = req.body;
      const { data, error } = await sb.from("usages").insert([{ key, label }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === "DELETE") {
      const { key } = req.body;
      const { data, error } = await sb.from("usages").delete().eq("key", key);
      if (error) throw error;
      return res.status(200).json({ deleted: key });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}

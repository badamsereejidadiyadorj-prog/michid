import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sb = supabaseServer();
    if (req.method === "GET") {
      const { data, error } = await sb.from("categories").select("*");
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { id, title_key, image } = req.body;
      const { data, error } = await sb
        .from("categories")
        .insert([{ id, title_key, image }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      const { data, error } = await sb.from("categories").delete().eq("id", id);
      if (error) throw error;
      return res.status(200).json({ deleted: id });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
}

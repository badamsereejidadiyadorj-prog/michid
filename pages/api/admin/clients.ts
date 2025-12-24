import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sb = supabaseServer();
    if (req.method === "GET") {
      // try to read clients table if exists
      const { data, error } = await sb.from("clients").select("*");
      if (error) return res.status(200).json([]);
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      const { name, logo, url } = req.body;
      const { data, error } = await sb
        .from("clients")
        .insert([{ name, logo, url }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(200).json([]);
  }
}

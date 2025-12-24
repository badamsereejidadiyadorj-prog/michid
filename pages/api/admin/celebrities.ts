import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sb = supabaseServer();
    if (req.method === "GET") {
      const { data, error } = await sb.from("celebrities").select("*");
      if (error) return res.status(200).json([]);
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      const { name, image, note } = req.body;
      const { data, error } = await sb
        .from("celebrities")
        .insert([{ name, image, note }]);
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    res.status(200).json([]);
  }
}

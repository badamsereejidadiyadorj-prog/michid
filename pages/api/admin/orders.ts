import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sb = supabaseServer();
  if (req.method === "GET") {
    try {
      const { data, error } = await sb
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || String(err) });
    }
  }

  if (req.method === "POST") {
    try {
      const { phone, address, items, total } = req.body;
      const payload = {
        phone: phone || null,
        address: address || null,
        items: items ? JSON.stringify(items) : "[]",
        total: total || 0,
        status: "new",
      };
      const { data, error } = await sb
        .from("orders")
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || String(err) });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}

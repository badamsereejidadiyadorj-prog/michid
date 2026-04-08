import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sb = supabaseServer();

  try {
    switch (req.method) {
      case "GET": {
        const { data, error } = await sb
          .from("products")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
      }

      case "POST": {
        const { data, error } = await sb
          .from("products")
          .insert(req.body)
          .select();

        if (error) throw error;
        return res.status(201).json(data);
      }

      case "PUT": {
        const { id, ...updateData } = req.body;

        const { data, error } = await sb
          .from("products")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json(data);
      }

      case "DELETE": {
        const { id } = req.body;

        const { error } = await sb.from("products").delete().eq("id", id);

        if (error) throw error;
        return res.status(200).json({ deleted: id });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end();
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

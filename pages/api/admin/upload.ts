import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../lib/supabaseServer";

type ReqBody = {
  bucket?: string;
  path: string; // path inside bucket, e.g. products/filename.jpg
  fileName?: string;
  base64: string; // file data base64
  contentType?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const sb = supabaseServer();
    const body = req.body as ReqBody;
    const bucket = body.bucket || "public";
    const path = body.path;
    if (!path || !body.base64)
      return res.status(400).json({ error: "path and base64 required" });

    const buffer = Buffer.from(body.base64, "base64");

    const { data, error } = await sb.storage.from(bucket).upload(path, buffer, {
      contentType: body.contentType || "application/octet-stream",
      upsert: true,
    });
    if (error) throw error;

    const publicUrl = sb.storage.from(bucket).getPublicUrl(path).publicUrl;
    return res.status(201).json({ path, publicUrl, data });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

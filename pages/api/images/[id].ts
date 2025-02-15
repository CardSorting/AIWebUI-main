import { NextApiRequest, NextApiResponse } from "next";
import { databaseAPI } from "@lib/DatabaseAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }
  
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Image id is required." });
  }
  const imageId = Array.isArray(id) ? id[0] : id;

  try {
    await databaseAPI.initialize();
    // Access the private pool via type-casting (this is a workaround)
    const queryText = "SELECT imageData, contentType FROM image_metadata WHERE id = $1";
    const result = await (databaseAPI as any).pool.query(queryText, [imageId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Image not found" });
    }
    const { imageData, contentType } = result.rows[0];
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", imageData.length);
    return res.status(200).send(imageData);
  } catch (err) {
    console.error("Error fetching image:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await databaseAPI.close();
  }
}

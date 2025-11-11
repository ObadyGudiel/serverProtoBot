// src/controllers/videoController.js
import { bucket } from "../config/credentiales.js";

export const descargarVideo = async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).send("Falta el parámetro 'path'");

    const file = bucket.file(path);

    // 🔹 Forzar headers de descarga
    res.setHeader("Content-Disposition", 'attachment; filename="video_evento.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const stream = file.createReadStream();
    stream.pipe(res);
  } catch (error) {
    console.error("Error al descargar video:", error);
    res.status(500).send("Error al obtener el archivo.");
  }
};

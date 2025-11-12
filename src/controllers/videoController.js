import { bucket } from "../config/credentiales.js";

export const descargarVideo = async (req, res) => {
  try {
    let { path } = req.query;

    if (!path) {
      return res.status(400).send("❌ Falta el parámetro 'path'.");
    }

    console.log("📥 Path recibido:", path);

    // 🧩 Si viene una URL completa de Firebase, extraemos solo el "object name"
    if (path.startsWith("http")) {
      const match = path.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        path = match[1]; // ejemplo: "videos%2Farchivo.mp4"
        console.log("🧩 Path extraído del enlace Firebase:", path);
      } else {
        return res.status(400).send("❌ URL de Firebase no válida.");
      }
    }

    // ⚙️ Decodificar solo una vez si viene con %2F
    if (path.includes("%2F")) {
      path = decodeURIComponent(path); // "videos/archivo.mp4"
    }

    console.log("📁 Path usado en el bucket:", path);

    const file = bucket.file(path);

    // Verificar si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      console.warn("⚠️ Archivo no encontrado en el bucket:", path);
      return res.status(404).send("El archivo solicitado no existe.");
    }

    // Obtener metadata
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    const fileName = path.split("/").pop();

    // Cabeceras para descarga
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    res.setHeader("Content-Type", contentType);

    // Crear stream
    const stream = file.createReadStream();
    stream.on("error", (err) => {
      console.error("❌ Error al leer el archivo:", err);
      if (!res.headersSent) {
        res.status(500).send("Error al leer el archivo del servidor.");
      }
    });

    stream.on("end", () => {
      console.log(`✅ Descarga completada: ${fileName}`);
    });

    stream.pipe(res);
  } catch (error) {
    console.error("💥 Error al descargar video:", error);
    if (!res.headersSent) {
      res.status(500).send("Error interno del servidor.");
    }
  }
};

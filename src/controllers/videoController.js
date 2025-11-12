import { bucket } from "../config/credentiales.js";

export const descargarVideo = async (req, res) => {
  try {
    let { path } = req.query;

    if (!path) {
      return res.status(400).send("❌ Falta el parámetro 'path'.");
    }

    // Decodificar si viene con %2F o caracteres especiales
    path = decodeURIComponent(path);
    console.log("📥 Solicitando descarga del archivo:", path);

    const file = bucket.file(path);

    // Verificar si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      console.warn("⚠️ Archivo no encontrado en el bucket:", path);
      return res.status(404).send("El archivo solicitado no existe.");
    }

    // Obtener metadata (por ejemplo, tipo MIME)
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    const fileName = path.split("/").pop();

    // Cabeceras para forzar descarga
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    res.setHeader("Content-Type", contentType);

    // Crear stream de lectura y enviar al cliente
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

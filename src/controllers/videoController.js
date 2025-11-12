import { bucket } from "../config/credentiales.js";

export const descargarVideo = async (req, res) => {
  try {
    let { path } = req.query;

    if (!path) {
      return res.status(400).send("❌ Falta el parámetro 'path'.");
    }

    // 🔍 Si viene un enlace completo de Firebase, extraer el nombre del objeto
    if (path.startsWith("http")) {
      const match = path.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        path = decodeURIComponent(match[1]); // ejemplo: "videos/archivo.mp4"
      } else {
        return res.status(400).send("❌ URL de Firebase no válida.");
      }
    } else {
      // Si viene codificado como videos%2Farchivo.mp4, decodificarlo
      if (path.includes("%2F")) {
        path = decodeURIComponent(path);
      }
    }

    // 📂 Obtener referencia al archivo en el bucket
    const file = bucket.file(path);

    // 🚨 Verificar existencia
    const [exists] = await file.exists();
    if (!exists) {
      console.warn("⚠️ Archivo no encontrado en el bucket:", path);
      return res.status(404).send("El archivo solicitado no existe.");
    }

    // 📄 Obtener metadata del archivo
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    const fileName = path.split("/").pop() || "video.mp4";

    // ⚙️ Cabeceras correctas para forzar descarga en TODOS los dispositivos
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // 🚀 Enviar el archivo como stream
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

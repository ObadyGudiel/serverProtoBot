import { bucket } from "../config/credentiales.js";

export const descargarVideo = async (req, res) => {
  try {
    let { path } = req.query;

    console.log("URL ", path)
    if (!path) return res.status(400).send("Falta el parámetro 'path'");

    // Si viene codificado (por ejemplo, con %2F), decodificarlo
    path = decodeURIComponent(path);

    const file = bucket.file(path);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.split("/").pop()}"`
    );
    res.setHeader("Content-Type", "video/mp4");

    const stream = file.createReadStream();
    stream.on("error", (err) => {
      console.error("Error leyendo el archivo:", err);
      res.status(500).send("Error al obtener el archivo.");
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Error al descargar video:", error);
    res.status(500).send("Error interno del servidor.");
  }
};

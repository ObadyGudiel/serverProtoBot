import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

// ✅ Configurar CORS correctamente para permitir descargas desde tu dominio Firebase
app.use(
  cors({
    origin: [
      "https://umg-convencion.web.app", // dominio principal de tu frontend
      "https://umg-convencion.firebaseapp.com", // dominio alternativo de Firebase Hosting
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Range"],
    exposedHeaders: [
      "Content-Disposition",
      "Content-Type",
      "Accept-Ranges",
      "Content-Length",
    ],
  })
);

// 🧠 Middleware adicional para Safari iOS
app.use((req, res, next) => {
  // Permite que Safari descargue binarios sin marcar error o convertirlos a texto
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Middleware general
app.use(express.json());

// Rutas
app.use("/api/videos", videoRoutes);

export default app;

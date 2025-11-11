import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/videos", videoRoutes);

export default app;

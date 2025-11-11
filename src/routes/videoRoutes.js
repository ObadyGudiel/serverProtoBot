import express from "express";
import { descargarVideo } from "../controllers/videoController.js";

const router = express.Router();

router.get("/descargar", descargarVideo);

export default router;

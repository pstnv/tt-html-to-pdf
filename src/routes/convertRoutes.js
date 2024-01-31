import express from "express";
import { handleConversion } from "../controllers/convertController.js";

const router = express.Router();

router.post("/html-to-pdf", handleConversion);

export default router;

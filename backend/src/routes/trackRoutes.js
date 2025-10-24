import express from "express";
import {trackClick} from "../controllers/trackController.js";

const router = express.Router();

router.get("/:campaignId/:email", trackClick);

export default router;

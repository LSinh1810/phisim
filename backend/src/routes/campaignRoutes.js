import express from "express";
import { createCampaign, getCampaigns, getCampaignById, deleteCampaign, testEmail } from "../controllers/campaignController.js";

const router = express.Router();

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.delete("/:id", deleteCampaign);
router.post("/test-email", testEmail);

export default router;
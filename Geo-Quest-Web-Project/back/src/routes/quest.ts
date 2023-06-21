import express from "express";
import { createQuest, getQuests, editQuest, deleteQuest } from "../controllers/quest";

const router = express.Router();

router.post("/api/addquest", createQuest);
router.post("/api/getquests", getQuests);
router.put("/api/editquest", editQuest);
router.delete("/api/deletequest", deleteQuest);

export default router;
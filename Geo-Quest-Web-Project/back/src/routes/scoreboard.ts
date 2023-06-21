import express from "express";
import { getLocationHistory, getScore, getRank, getRanking } from "../controllers/scoreboard"

const router = express.Router();

router.get( '/api/getlocationhistory/:userId', getLocationHistory);
router.get('/api/getscore/:userId', getScore);
router.get('/api/getrank/:userId', getRank);
router.get('/api/getranking/:limit', getRanking);

export default router;

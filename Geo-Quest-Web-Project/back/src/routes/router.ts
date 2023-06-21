import express from "express";
import user from "./user";
import quest from "./quest";
import location from "./location";
import scoreboard from "./scoreboard";

const router = express.Router();
router.use(user);
router.use(quest);
router.use(location);
router.use(scoreboard);

export default router;

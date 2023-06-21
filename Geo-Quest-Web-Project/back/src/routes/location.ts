import express from "express";
import { createLocation, getLocations, claimLocation, removeLocation, editLocation } from "../controllers/location";

const router = express.Router();

router.get("/api/getlocations/:questId", getLocations);
router.post("/api/claimlocation", claimLocation);
router.post("/api/addlocation", createLocation);
router.put("/api/editlocation", editLocation);
router.delete("/api/removelocation", removeLocation);

export default router;
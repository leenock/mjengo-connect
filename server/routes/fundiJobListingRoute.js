import express from "express";
import { authenticateFundiToken } from "../middleware/fundiAuth.js";
import {
  getFundiJobListingsController,
  getFundiJobListingByIdController,
} from "../controllers/fundiJobListingController.js";

const router = express.Router();

router.use(authenticateFundiToken);

/** Fundi job board — server enforces free-plan limits */
router.get("/", getFundiJobListingsController);
router.get("/:id", getFundiJobListingByIdController);

export default router;

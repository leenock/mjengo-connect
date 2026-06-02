import express from "express";
import {
  registerClientUser,
  getAllClientUsers,
  getClientuserById,
  updateClientUserController,
  adminUpdateClientUserController,
  changeMyPasswordController,
  deleteClientUserController,
} from "../controllers/clientUserController.js";
import { validate } from "../middleware/validate.js";
import {
  registerClientUserSchema,
  updateClientUserSchema,
  adminUpdateClientUserSchema,
  changeClientPasswordSchema,
} from "../utils/validation/client_UserValidation.js";

import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { strictAuthLimiter, registrationLimiter } from "../middleware/rateLimit.js";



const router = express.Router();

router.post(
  "/registerClient",
  registrationLimiter,
  validate(registerClientUserSchema),
  registerClientUser
);
router.get("/getAllClientUsers", adminAuthMiddleware, getAllClientUsers);
router.get("/getAllClientUsers/:id", authenticateToken, getClientuserById);
router.put("/updateClientUser/:id", authenticateToken, validate(updateClientUserSchema), updateClientUserController);
router.put(
  "/updateClientUserAdmin/:id",
  adminAuthMiddleware,
  validate(adminUpdateClientUserSchema),
  adminUpdateClientUserController
);
router.post("/changePassword", strictAuthLimiter, authenticateToken, validate(changeClientPasswordSchema), changeMyPasswordController);
router.delete("/deleteClientUser/:id",adminAuthMiddleware, superAdminMiddleware, deleteClientUserController);

export default router;

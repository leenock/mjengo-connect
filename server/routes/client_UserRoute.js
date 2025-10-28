import express from "express";
import {
  registerClientUser,
  getAllClientUsers,
  getClientuserById,
  updateClientUserController,
  updatePasswordController,
  deleteClientUserController,
} from "../controllers/clientUserController.js";
import { validate } from "../middleware/validate.js";
import { registerClientUserSchema } from "../utils/validation/client_UserValidation.js";

import { adminAuthMiddleware, superAdminMiddleware } from "../middleware/adminAuth.js";



const router = express.Router();

router.post(
  "/registerClient",
  validate(registerClientUserSchema),
  registerClientUser
);
router.get("/getAllClientUsers", adminAuthMiddleware, getAllClientUsers);
router.get("/getAllClientUsers/:id", getClientuserById);
router.put("/updateClientUser/:id", updateClientUserController);
router.post("/updatePassword", updatePasswordController);
router.delete("/deleteClientUser/:id",adminAuthMiddleware, superAdminMiddleware, deleteClientUserController);

export default router;

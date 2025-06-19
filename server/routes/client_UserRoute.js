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

const router = express.Router();

router.post(
  "/registerClient",
  validate(registerClientUserSchema),
  registerClientUser
);
router.get("/getAllClientUsers", getAllClientUsers);
router.get("/getAllClientUsers/:id", getClientuserById);
router.put("/updateClientUser/:id", updateClientUserController);
router.post("/updatePassword", updatePasswordController);
router.delete("/deleteClientUser/:id", deleteClientUserController);

export default router;

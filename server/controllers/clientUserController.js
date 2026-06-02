import {
  registerClient,
  getAllClients,
  getClientById,
  updateClientUser,
  adminUpdateClientUser,
  updateClientUserPassword,
  deleteClientUser,
  loginClientUser,
  logoutClientUser,
} from "../services/clientUserService.js";
import { serverLog } from "../utils/appLogger.js";

// Client User Controller
/**
 * Handles the registration of a new client user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send back the result.
 */
export const registerClientUser = async (req, res) => {
  try {
    const newUser = await registerClient(req.body);
    
    // Remove password from response using delete operator
    const userSafe = { ...newUser }
    delete userSafe.password
    
    res.status(201).json({
      message: "Client user registered successfully",
      user: userSafe
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({
      error: error.message || "Internal server error",
    });
  }
};

// get all client users
export const getAllClientUsers = async (req, res) => {
  try {
    const clients = await getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Get All Clients Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
// get single client user
export const getClientuserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Only allow the authenticated user to view their own record.
    if (req.user?.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const client = await getClientById(id); // ✅ pass as string
    res.status(200).json(client);
  } catch (error) {
    console.error("Get Client By ID Error:", error);
    res.status(404).json({ message: error.message || "Client not found" });
  }
};
// update client user
export const updateClientUserController = async (req, res) => {
  const { id } = req.params;
  try {
    // Only allow the authenticated user to update their own record.
    if (req.user?.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // Prevent privilege/account-state updates through this endpoint.
    const {
      password,
      isActive,
      accountStatus,
      passwordResetToken,
      passwordResetTokenExpiresAt,
      otp,
      otpExpiresAt,
      ...safeBody
    } = req.body || {};
    const updatedUser = await updateClientUser(id, safeBody);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Client User Error:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

export const adminUpdateClientUserController = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      password,
      passwordResetToken,
      passwordResetTokenExpiresAt,
      otp,
      otpExpiresAt,
      ...safeBody
    } = req.body || {};
    const updatedUser = await adminUpdateClientUser(id, safeBody);
    res.status(200).json({
      message: "Client updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin Update Client User Error:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

// change client user password (authenticated, requires current password)
export const changeMyPasswordController = async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body || {};

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "currentPassword and newPassword are required." });
  }

  try {
    const updatedUser = await updateClientUserPassword({ userId, currentPassword, newPassword });
    return res.status(200).json({
      message: "Password updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Password Change Error:", error);
    const status = error.message?.toLowerCase().includes("invalid") ? 401 : 400;
    return res.status(status).json({ message: error.message || "Password update failed." });
  }
};
/**
 * Controller to delete a client user by ID.
 */
export const deleteClientUserController = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteClientUser(id);
    res.status(200).json(result); // { message: "Client user deleted successfully" }
  } catch (error) {
    console.error("Delete Client User Error:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};

//****************************Client User Controller Login Functionality*****************************************/

export const loginController = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Validate required fields
  if (!emailOrPhone || !password) {
    return res.status(400).json({ 
      message: "Email/phone and password are required" 
    });
  }

  try {
    const { token, user } = await loginClientUser({ emailOrPhone, password });

    const userSafe = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      location: user.location,
      isActive: user.isActive,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: userSafe,
    });
  } catch (error) {
    console.error("Login Error:", error);
    
    // More specific error handling with appropriate status codes
    if (error.message.includes("deactivated") || 
        error.message.includes("suspended") || 
        error.message.includes("pending") ||
        error.message.includes("inactive")) {
      return res.status(403).json({ 
        message: error.message 
      });
    } else if (error.message.includes("not found") || error.message.includes("Invalid credentials")) {
      return res.status(401).json({ 
        message: "Invalid email/phone or password" 
      });
    } else {
      return res.status(500).json({ 
        message: error.message || "Login failed" 
      });
    }
  }
};

// logout controller
export const logoutController = async (req, res) => {
  try {
    await logoutClientUser(req.user?.id);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    serverLog.error("Client Logout", "Logout failed", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

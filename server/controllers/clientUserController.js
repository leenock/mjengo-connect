import {
  registerClient,
  getAllClients,
  getClientById,
  updateClientUser,
  updateClientUserPassword,
  deleteClientUser,
} from "../services/clientUserService.js";

// Client User Controller
/**
 * Handles the registration of a new client user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send back the result.
 */
export const registerClientUser = async (req, res) => {
  try {
    const newUser = await registerClient(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
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
    const updatedUser = await updateClientUser(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Client User Error:", error);
    res.status(400).json({ message: error.message || "Internal server error" });
  }
};
// update client user password
export const updatePasswordController = async (req, res) => {
  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res
      .status(400)
      .json({ message: "Identifier and newPassword are required." });
  }

  try {
    const updatedUser = await updateClientUserPassword(identifier, newPassword);
    res.status(200).json({
      message: "Password updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Password Update Error:", error);
    res
      .status(400)
      .json({ message: error.message || "Password update failed." });
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

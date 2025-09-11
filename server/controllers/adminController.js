import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdminRole,
} from "../services/adminService.js"

// Admin Controller
/**
 * Handles the creation of a new admin user.
 * @param {Object} req - The request object containing admin data.
 * @param {Object} res - The response object to send back the result.
 */
export const createAdminUser = async (req, res) => {
  try {
    const newAdmin = await createAdmin(req.body)

    // Remove password from response using delete operator
    const adminSafe = { ...newAdmin }
    delete adminSafe.password

    res.status(201).json({
      message: "Admin user created successfully",
      admin: adminSafe,
    })
  } catch (error) {
    console.error("Create Admin Error:", error)
    res.status(400).json({
      error: error.message || "Internal server error",
    })
  }
}

/**
 * Get all admin users
 */
export const getAllAdminUsers = async (req, res) => {
  try {
    const admins = await getAllAdmins()
    res.status(200).json(admins)
  } catch (error) {
    console.error("Get All Admins Error:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}

/**
 * Get single admin user by ID
 */
export const getAdminUserById = async (req, res) => {
  const { id } = req.params
  try {
    const admin = await getAdminById(id)
    res.status(200).json(admin)
  } catch (error) {
    console.error("Get Admin By ID Error:", error)
    res.status(404).json({ message: error.message || "Admin not found" })
  }
}

/**
 * Update admin user
 */
export const updateAdminUserController = async (req, res) => {
  const { id } = req.params
  try {
    const updatedAdmin = await updateAdmin(id, req.body)
    res.status(200).json(updatedAdmin)
  } catch (error) {
    console.error("Update Admin User Error:", error)
    res.status(400).json({ message: error.message || "Internal server error" })
  }
}

/**
 * Update admin user password
 */
export const updateAdminPasswordController = async (req, res) => {
  const { identifier, newPassword } = req.body

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: "Identifier and newPassword are required." })
  }

  try {
    const updatedAdmin = await updateAdminPassword(identifier, newPassword)
    res.status(200).json({
      message: "Password updated successfully.",
      admin: updatedAdmin,
    })
  } catch (error) {
    console.error("Admin Password Update Error:", error)
    res.status(400).json({ message: error.message || "Password update failed." })
  }
}

/**
 * Controller to delete an admin user by ID.
 */
export const deleteAdminUserController = async (req, res) => {
  const { id } = req.params

  try {
    const result = await deleteAdmin(id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Delete Admin User Error:", error)
    res.status(400).json({ message: error.message || "Internal server error" })
  }
}

//****************************Admin Authentication Controllers*****************************************/

/**
 * Admin login controller
 */
export const adminLoginController = async (req, res) => {
  const { emailOrPhone, password } = req.body

  try {
    const { token, admin } = await loginAdmin({ emailOrPhone, password })

    const adminSafe = {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      lastLogin: admin.lastLogin?.toISOString(),
      createdAt: admin.createdAt?.toISOString(),
      updatedAt: admin.updatedAt?.toISOString(),
    }

    res.status(200).json({
      message: "Login successful",
      token,
      admin: adminSafe,
    })
  } catch (error) {
    console.error("Admin Login Error:", error)
    res.status(401).json({ message: error.message || "Login failed" })
  }
}

/**
 * Admin logout controller
 */
export const adminLogoutController = async (_req, res) => {
  try {
    await logoutAdmin()
    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.error("Admin Logout Error:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}

/**
 * Update admin role controller (Super Admin only)
 */
export const updateAdminRoleController = async (req, res) => {
  const { adminId } = req.params
  const { newRole } = req.body
  const requesterId = req.admin?.id // From auth middleware

  if (!newRole) {
    return res.status(400).json({ message: "New role is required" })
  }

  // Validate role
  const validRoles = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"]
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role specified" })
  }

  try {
    const updatedAdmin = await updateAdminRole(adminId, newRole, requesterId)
    res.status(200).json({
      message: "Admin role updated successfully",
      admin: updatedAdmin,
    })
  } catch (error) {
    console.error("Update Admin Role Error:", error)
    res.status(403).json({ message: error.message || "Role update failed" })
  }
}

/**
 * Toggle admin status (activate/deactivate)
 */
export const toggleAdminStatusController = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
    return res.status(400).json({ message: "Valid status is required (ACTIVE or INACTIVE)" })
  }

  try {
    const updatedAdmin = await updateAdmin(id, { status })
    res.status(200).json({
      message: `Admin ${status.toLowerCase()} successfully`,
      admin: updatedAdmin,
    })
  } catch (error) {
    console.error("Toggle Admin Status Error:", error)
    res.status(400).json({ message: error.message || "Status update failed" })
  }
}

/**
 * Get admin profile (current logged-in admin)
 */
export const getAdminProfileController = async (req, res) => {
  const adminId = req.admin?.id // From auth middleware

  try {
    const admin = await getAdminById(adminId)
    res.status(200).json(admin)
  } catch (error) {
    console.error("Get Admin Profile Error:", error)
    res.status(404).json({ message: error.message || "Admin profile not found" })
  }
}

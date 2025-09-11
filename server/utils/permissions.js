/**
 * Permission system for admin roles
 */

// Define permissions for each role
export const PERMISSIONS = {
  SUPER_ADMIN: [
    "admin.create",
    "admin.read",
    "admin.update",
    "admin.delete",
    "admin.role.update",
    "admin.status.toggle",
    "client.read",
    "client.update",
    "client.delete",
    "fundi.read",
    "fundi.update",
    "fundi.delete",
    "job.read",
    "job.update",
    "job.delete",
    "job.moderate",
    "support.read",
    "support.update",
    "support.assign",
    "system.logs",
    "system.settings",
  ],
  ADMIN: [
    "admin.read",
    "client.read",
    "client.update",
    "fundi.read",
    "fundi.update",
    "job.read",
    "job.update",
    "job.moderate",
    "support.read",
    "support.update",
    "support.assign",
    "system.logs",
  ],
  MODERATOR: ["client.read", "fundi.read", "job.read", "job.moderate", "support.read", "support.update"],
  SUPPORT: ["client.read", "fundi.read", "support.read", "support.update"],
}

/**
 * Check if a role has a specific permission
 * @param {string} role - Admin role
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether the role has the permission
 */
export const hasPermission = (role, permission) => {
  return PERMISSIONS[role]?.includes(permission) || false
}

/**
 * Middleware to check specific permissions
 * @param {string} permission - Required permission
 * @returns {Function} - Express middleware function
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    const adminRole = req.admin?.role

    if (!adminRole) {
      return res.status(401).json({
        message: "Authentication required",
      })
    }

    if (!hasPermission(adminRole, permission)) {
      return res.status(403).json({
        message: `Access denied. Required permission: ${permission}`,
      })
    }

    next()
  }
}

/**
 * Get all permissions for a role
 * @param {string} role - Admin role
 * @returns {Array} - Array of permissions
 */
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || []
}

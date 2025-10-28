import {
  registerFundi,
  getAllFundis,
  getFundiById,
  updateFundiUser,
  updateFundiUserPassword,
  deleteFundiUser,
  loginFundiUser,
  logoutFundiUser,
} from "../services/fundiUserService.js"

// Fundi User Controller
/**
 * Handles the registration of a new fundi user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send back the result.
 */
export const registerFundiUserController = async (req, res) => {
  try {
    const newUser = await registerFundi(req.body)

    // Remove password from response using delete operator
    const userSafe = { ...newUser }
    delete userSafe.password

    res.status(201).json({
      message: "Fundi user registered successfully",
      user: userSafe,
    })
  } catch (error) {
    console.error("Register Fundi Error:", error)
    res.status(400).json({
      error: error.message || "Internal server error",
    })
  }
}

/**
 * Get all fundi users
 */
export const getAllFundiUsers = async (req, res) => {
  try {
    const fundis = await getAllFundis()
    res.status(200).json({
      message: "Fundis retrieved successfully",
      fundis,
      count: fundis.length,
    })
  } catch (error) {
    console.error("Get All Fundis Error:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}

/**
 * Get single fundi user by ID
 */
export const getFundiUserById = async (req, res) => {
  const { id } = req.params
  try {
    const fundi = await getFundiById(id)
    res.status(200).json({
      message: "Fundi retrieved successfully",
      fundi,
    })
  } catch (error) {
    console.error("Get Fundi By ID Error:", error)
    res.status(404).json({ message: error.message || "Fundi not found" })
  }
}

/**
 * Update fundi user
 */
export const updateFundiUserController = async (req, res) => {
  const { id } = req.params
  try {
    const updatedUser = await updateFundiUser(id, req.body)
    res.status(200).json({
      message: "Fundi user updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update Fundi User Error:", error)
    res.status(400).json({ message: error.message || "Internal server error" })
  }
}

/**
 * Update fundi user password
 */
export const updateFundiPasswordController = async (req, res) => {
  const { identifier, newPassword } = req.body

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: "Identifier and newPassword are required." })
  }

  try {
    const updatedUser = await updateFundiUserPassword(identifier, newPassword)
    res.status(200).json({
      message: "Password updated successfully.",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Fundi Password Update Error:", error)
    res.status(400).json({ message: error.message || "Password update failed." })
  }
}

/**
 * Controller to delete a fundi user by ID.
 */
export const deleteFundiUserController = async (req, res) => {
  const { id } = req.params

  try {
    const result = await deleteFundiUser(id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Delete Fundi User Error:", error)
    res.status(400).json({ message: error.message || "Internal server error" })
  }
}

//****************************Fundi User Controller Login Functionality*****************************************/

/**
 * Login controller for fundi users
 */
export const loginFundiController = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Validate required fields
  if (!emailOrPhone || !password) {
    return res.status(400).json({ 
      message: "Email/phone and password are required" 
    });
  }

  try {
    const { token, user } = await loginFundiUser({ emailOrPhone, password });

    const userSafe = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      primary_skill: user.primary_skill,
      experience_level: user.experience_level,
      biography: user.biography,
      accountStatus: user.accountStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt?.toISOString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userSafe,
    });
  } catch (error) {
    console.error("Fundi Login Error:", error);
    
    // Specific error handling for pending and suspended accounts
    if (error.message.includes("suspended") || error.message.includes("pending approval")) {
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
/**
 * Logout controller for fundi users
 */
export const logoutFundiController = async (_req, res) => {
  try {
    await logoutFundiUser()
    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.error("Fundi Logout Error:", error)
    res.status(500).json({ message: error.message || "Internal server error" })
  }
}

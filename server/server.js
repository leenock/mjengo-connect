// Import required modules
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Import routes
import client_UserRoute from "./routes/client_UserRoute.js"
import client_authRoute from "./routes/client_authRoute.js"
import jobRoute from "./routes/jobRoute.js"
import ticketUsersRoute from "./routes/ticketUsersRoute.js"
import fundi_authRoute from "./routes/fundi_authRoute.js"
import savedJobRoutes from "./routes/savedJobRoute.js" // New saved job routes
import adminRoute from "./routes/adminRoute.js"
import adminAuthRoute from "./routes/adminAuthRoute.js"
import adminManagementRoute from "./routes/adminManagementRoute.js" // Added admin management route import
import adminSupportTicketsRoute from "./routes/adminSupportTickets.js" // Added admin support ticket routes import
import ticketsFundiRoute from "./routes/ticketsFundiRoute.js" // Added fundi tickets route import

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running on port 5000!")
})

// Client User Routes
app.use("/api/client", client_UserRoute)

// Use the auth routes under /api/auth
app.use("/api/client/auth", client_authRoute)

// Job Routes
app.use("/api/client", jobRoute)

// Support Ticket Routes
app.use("/api/support", ticketUsersRoute)

// Fundi User Routes // Added fundi route usage
app.use("/api/fundi", fundi_authRoute)

// saved Job Routes
app.use("/api/fundi/saved-jobs", savedJobRoutes)

// Admin Management Routes
app.use("/api/admin", adminRoute)

// Admin Authentication Routes
app.use("/api/admin/auth", adminAuthRoute)

// Admin Management & Dashboard Routes
app.use("/api/admin/management", adminManagementRoute) // Added admin management routes for dashboard and system operations

// Admin Support Ticket Routes
app.use("/api/admin/support", adminSupportTicketsRoute) // Added admin support ticket routes

// Fundi Support Ticket Routes
app.use("/api/fundi/tickets", ticketsFundiRoute) // Added fundi tickets routes

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`)
})

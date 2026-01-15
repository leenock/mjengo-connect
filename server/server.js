// Import required modules
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from "node-cron"
import { expirePaidJobs } from "./services/jobService.js"

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
import ticketSupportRoute from "./routes/ticketSupportRoute.js" // Added ticket support route import

import adminJobRoutes from './routes/adminJobRoutes.js'; // Import admin job routes
import clientWalletRoute from './routes/clientWalletRoute.js'; // Import client wallet routes

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

// Client Wallet Routes (KopoKopo integration)
app.use("/api/client/wallet", clientWalletRoute)

// Job Routes
app.use("/api/client", jobRoute)

// Use admin routes
app.use('/api/admin/jobs', adminJobRoutes);

// Support Ticket Routes
app.use("/api/support", ticketUsersRoute)

// Fundi User Routes // Added fundi route usage
app.use("/api/fundi", fundi_authRoute)

// Fundi User Admin Route Path
app.use("/api/fundi/admin", fundi_authRoute)

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

// Ticket Support Reply Routes
app.use("/api/admin/support/tickets", ticketSupportRoute) // Added ticket support reply routes

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`)
})

// Schedule job expiration task to run daily at 2:00 AM
// This will expire jobs that have been paid for more than 7 days
cron.schedule("0 2 * * *", async () => {
  try {
    console.log("🕐 Running scheduled job expiration check...");
    const result = await expirePaidJobs();
    console.log(`✅ Job expiration check completed: ${result.message}`);
  } catch (error) {
    console.error("❌ Error running job expiration check:", error);
  }
}, {
  timezone: "Africa/Nairobi" // Adjust to your timezone
});

console.log("📅 Scheduled job expiration task: Daily at 2:00 AM (Africa/Nairobi timezone)");

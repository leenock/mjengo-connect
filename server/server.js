// Import required modules
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
// Import routes
import client_UserRoute from "./routes/client_UserRoute.js"
import client_authRoute from "./routes/client_authRoute.js"
import jobRoute from "./routes/jobRoute.js"
import ticketUsersRoute from "./routes/ticketUsersRoute.js"

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

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`)
})

// Import required modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import routes
 import client_UserRoute from './routes/client_UserRoute.js'; 

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Root route
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running on port 5000!');
});

// Client User Routes
app.use('/api/client', client_UserRoute); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

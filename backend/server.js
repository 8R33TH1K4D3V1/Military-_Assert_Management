// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware'); // Import the error handler if you created it
const { seedInitialData } = require('./controllers/assignmentController'); // Import the seed function

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For form data
app.use(cors()); // Enable CORS for all routes

// Import routes
const assetRoutes = require('./routes/assetRoutes');
const personnelRoutes = require('./routes/personnelRoutes'); // New: Personnel Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Use routes
app.use('/api/assets', assetRoutes);
app.use('/api/personnel', personnelRoutes); // New: Personnel Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);


// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Seed initial data after DB connection (call once at app start in dev)
// Consider moving this to a separate script for production or ensure it's idempotent
// It's called after routes so models are registered, but before server starts listening.
seedInitialData(); // Call the seeding function

// Error handling middleware (should be last middleware)
app.use(errorHandler); // This will catch errors thrown by asyncHandler

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
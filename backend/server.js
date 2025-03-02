import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import otpRoutes from './routes/otpRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path'
import cors from 'cors';
import { sessionMiddleware } from './middleware/authmiddleware.js';
import jobListingRoutes from "./routes/jobListingRoutes.js";
import jobStatusRoutes from "./routes/jobStatusRoutes.js";
import passwordValidationRoutes from "./routes/passwordValidationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { fileURLToPath } from 'url';

dotenv.config();

connectDB();

const app = express();

app.use(sessionMiddleware);

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'https://jobx-uu5x.onrender.com',
  'http://localhost:3000', // For local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (req, res) => {
  res.send('API is running.....');
});

// Use userRoutes for user-related functionality
app.use('/api/users', userRoutes);

// Use otpRoutes for OTP-related functionality
app.use('/api', otpRoutes);

app.use('/api/joblistings', jobListingRoutes);

app.use('/api/jobstatus', jobStatusRoutes);

app.use('/api/users/validate-password', passwordValidationRoutes);

app.use('/api', uploadRoutes);
app.use('/api/messages', messageRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(new URL('./uploads', import.meta.url).pathname));


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(
  PORT,'0.0.0.0',
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
// const path = require('path');

// // Serve static files from the React frontend app
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // Catch-all handler to serve the frontend for any route not handled by the backend
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ... your API routes here ...

// Always serve the React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});



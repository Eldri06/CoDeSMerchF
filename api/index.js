import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import Firebase config
import './config/firebase.js';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import storageRoutes from './routes/storageRoutes.js';

const app = express();

// CORS setup
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true); 
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Test route - ROOT
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'CoDeSMerch Backend API (Serverless)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/storage', storageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Export the app for Vercel Serverless
export default app;

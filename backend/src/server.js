const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Firebase config
require('./config/firebase');

const app = express();

// CORS setup before other middleware
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());

// Test route - ROOT
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'CoDeSMerch Backend API',
    timestamp: new Date().toISOString()
  });
});

// Test route - /api
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/storage', require('./routes/storageRoutes'));

// 404 handler - This should be LAST
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔥 Test it: http://localhost:${PORT}/api`);
  console.log(`✅ CORS configured. Allowed: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'ALL (dev fallback)'}`);
});

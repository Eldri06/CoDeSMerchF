const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Firebase config
require('./config/firebase');

const app = express();

// Middleware
app.use(cors());
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

// 404 handler - This should be LAST
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.url}` 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔥 Test it: http://localhost:${PORT}/api`);
});
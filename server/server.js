// Load env variables FIRST — before any other module reads process.env
require('dotenv').config();

// express-async-errors patches Express so async errors auto-propagate to error handler
require('express-async-errors');

const express      = require('express');
const path         = require('path');
const cors         = require('cors');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const taskRoutes   = require('./routes/taskRoutes');
const authRoutes   = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// ── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ── App Instance ───────────────────────────────────────────────────────────
const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────

// CORS — allow requests from the React dev server (port 5173) and production
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// HTTP request logger (compact format in dev, combined in prod)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form bodies (good practice to include)
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

// Health-check endpoint — useful for deployment platforms (Railway, Render, etc.)
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Task Tracker API is running 🚀' });
});

// ── Serve Frontend in Production ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // 404 handler for API — catches any route not matched above in development
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
  });
}

// ── Global Error Handler (must be LAST) ────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

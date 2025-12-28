var express = require('express');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

// Core middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080', // 'http://localhost:8080'
  credentials: true,
}));

// Routes
app.use('/', indexRouter);

// <<<<<< 最重要的 2 塊 !!!!! >>>>>>

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Server Error'
  });
});

module.exports = app;

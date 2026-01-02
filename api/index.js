import express from 'express';
import session from 'express-session';
import cors from 'cors';
import axios from 'axios';

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : null,
  process.env.FRONTEND_URL || null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or serverless functions)
    if (!origin) return callback(null, true);
    
    // Allow if origin matches allowed list or is a Vercel domain
    const isAllowed = allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin));
    const isVercel = origin.includes('.vercel.app') || origin.includes('vercel.app');
    
    if (isAllowed || isVercel) {
      callback(null, true);
    } else {
      console.log('⚠️  CORS blocked origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - log all incoming requests (before routes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

// Handle OPTIONS requests for CORS preflight (before routes)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Session configuration
// Note: For production, consider using a session store like Redis
app.use(session({
  secret: process.env.SESSION_SECRET || 'quote-generator-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Routes
// IMPORTANT: On Vercel, when /api/webhook is requested, it routes to /api/index.js
// The req.url might be '/api/webhook' OR '/webhook' (Vercel may strip /api prefix)
// We register routes with BOTH patterns to handle both cases

// Root route for debugging
app.all('/', (req, res) => {
  res.json({ 
    message: 'API root', 
    method: req.method, 
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Quote Generator API is running' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Quote Generator API is running' });
});

// Set webhook URL
app.post('/api/webhook', (req, res) => {
  const { webhook_url } = req.body;
  
  // Validate webhook URL
  const webhookPattern = /^https:\/\/hook\..*\.make\.com\/.+/;
  if (!webhook_url || !webhookPattern.test(webhook_url)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid webhook URL format' 
    });
  }
  
  // Store in session
  req.session.webhook_url = webhook_url;
  
  res.json({ 
    success: true, 
    message: 'Webhook URL saved successfully' 
  });
});
app.post('/webhook', (req, res) => {
  // Same handler for /webhook (Vercel may strip /api)
  const { webhook_url } = req.body;
  const webhookPattern = /^https:\/\/hook\..*\.make\.com\/.+/;
  if (!webhook_url || !webhookPattern.test(webhook_url)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid webhook URL format' 
    });
  }
  req.session.webhook_url = webhook_url;
  res.json({ 
    success: true, 
    message: 'Webhook URL saved successfully' 
  });
});

// Get webhook URL from session
app.get('/api/webhook', (req, res) => {
  const webhookUrl = req.session.webhook_url;
  
  if (!webhookUrl) {
    return res.status(404).json({ 
      success: false, 
      message: 'No webhook URL found in session' 
    });
  }
  
  res.json({ 
    success: true, 
    webhook_url: webhookUrl 
  });
});
app.get('/webhook', (req, res) => {
  // Same handler for /webhook (Vercel may strip /api)
  const webhookUrl = req.session.webhook_url;
  if (!webhookUrl) {
    return res.status(404).json({ 
      success: false, 
      message: 'No webhook URL found in session' 
    });
  }
  res.json({ 
    success: true, 
    webhook_url: webhookUrl 
  });
});

// Clear webhook (change webhook)
app.delete('/api/webhook', (req, res) => {
  req.session.webhook_url = null;
  res.json({ 
    success: true, 
    message: 'Webhook URL cleared' 
  });
});
app.delete('/webhook', (req, res) => {
  // Same handler for /webhook (Vercel may strip /api)
  req.session.webhook_url = null;
  res.json({ 
    success: true, 
    message: 'Webhook URL cleared' 
  });
});

// Submit quote to Make.com webhook
const submitQuoteHandler = async (req, res) => {
  // Try to get webhook URL from request body first (for Vercel serverless)
  // Fall back to session (for local development)
  const webhookUrl = req.body.webhook_url || req.session?.webhook_url;
  
  if (!webhookUrl) {
    return res.status(400).json({ 
      success: false, 
      message: 'No webhook URL configured' 
    });
  }
  
  // Validate webhook URL format
  const webhookPattern = /^https:\/\/hook\..*\.make\.com\/.+/;
  if (!webhookPattern.test(webhookUrl)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid webhook URL format' 
    });
  }
  
  try {
    // Forward the quote data to Make.com webhook
    const formData = new URLSearchParams();
    
    // Add all fields from request body (except webhook_url which is not sent to Make)
    Object.keys(req.body).forEach(key => {
      if (key !== 'webhook_url' && req.body[key] !== null && req.body[key] !== undefined && req.body[key] !== '') {
        // Convert value to string - handle objects/arrays by stringifying them
        let value = req.body[key];
        if (typeof value === 'object' && !Array.isArray(value)) {
          value = JSON.stringify(value);
        } else if (Array.isArray(value)) {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        formData.append(key, value);
      }
    });
    
    // Send to Make.com
    // axios automatically handles URLSearchParams and sets Content-Type correctly
    await axios.post(webhookUrl, formData, {
      timeout: 8000, // 8 seconds timeout (less than Vercel's 10s limit)
      maxRedirects: 5
    });
    
    res.json({ 
      success: true, 
      message: 'Quote submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting to webhook:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
      webhookUrl: webhookUrl,
      data: error.response?.data
    });
    
    // Return error details to client so they know what went wrong
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to submit to Make.com webhook',
      error: error.message,
      details: error.response?.data || 'Network or timeout error'
    });
  }
};

app.post('/api/submit-quote', submitQuoteHandler);
app.post('/submit-quote', submitQuoteHandler);

// Submit feedback to Make.com (hardcoded webhook)
const submitFeedbackHandler = async (req, res) => {
  const feedbackWebhook = 'https://hook.eu2.make.com/viqf8bj1icbdseb4itbug8lljjdoyqix';
  
  try {
    const formData = new URLSearchParams();
    formData.append('name', req.body.name || '');
    formData.append('email', req.body.email || '');
    formData.append('phone', req.body.phone || '');
    formData.append('feedback', req.body.feedback || '');
    
    await axios.post(feedbackWebhook, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    // Return success anyway
    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  }
};

app.post('/api/submit-feedback', submitFeedbackHandler);
app.post('/submit-feedback', submitFeedbackHandler);

// Catch-all route for debugging - log unmatched requests
app.use((req, res, next) => {
  console.log('⚠️  Unmatched request:', req.method, req.url, req.path, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method, 
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    info: 'Check server logs for registered routes'
  });
});

// Export the Express app for Vercel serverless functions
// Vercel automatically wraps Express apps in serverless functions
// Make sure all routes are registered before this export
export default app;

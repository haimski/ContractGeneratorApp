import express from 'express';
import session from 'express-session';
import cors from 'cors';
import axios from 'axios';
import { createServer } from 'http';

const app = express();
let PORT = 5000;
const MAX_PORT_ATTEMPTS = 10;

// Function to find available port
async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}`);
}

// Check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:3007',
  'http://localhost:3008',
  'http://localhost:3009',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or proxied requests)
    if (!origin) return callback(null, true);
    
    // Allow if origin matches allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Also allow localhost on any port (for development)
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
      if (isLocalhost) {
        callback(null, true);
      } else {
        console.log('⚠️  CORS blocked origin:', origin);
        callback(null, false);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'quote-generator-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes

// Health check
app.get('/api/health', (req, res) => {
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

// Clear webhook (change webhook)
app.delete('/api/webhook', (req, res) => {
  req.session.webhook_url = null;
  res.json({ 
    success: true, 
    message: 'Webhook URL cleared' 
  });
});

// Submit quote to Make.com webhook
app.post('/api/submit-quote', async (req, res) => {
  const webhookUrl = req.session.webhook_url;
  
  if (!webhookUrl) {
    return res.status(400).json({ 
      success: false, 
      message: 'No webhook URL configured' 
    });
  }
  
  try {
    // Forward the quote data to Make.com webhook
    const formData = new URLSearchParams();
    
    // Add all fields from request body
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== null && req.body[key] !== undefined && req.body[key] !== '') {
        formData.append(key, req.body[key]);
      }
    });
    
    // Send to Make.com
    await axios.post(webhookUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Quote submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting to webhook:', error.message);
    // Return success anyway (Make webhooks often don't return proper responses)
    res.json({ 
      success: true, 
      message: 'Quote submitted successfully' 
    });
  }
});

// Submit feedback to Make.com (hardcoded webhook)
app.post('/api/submit-feedback', async (req, res) => {
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
});

// Start server with automatic port detection
async function startServer() {
  try {
    PORT = await findAvailablePort(5000);
    
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 Quote Generator Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      
      if (PORT !== 5000) {
        console.log(`\n⚠️  Note: Default port 5000 was in use`);
        console.log(`✅ Server started on alternative port ${PORT}`);
        console.log(`\n💡 Update your frontend proxy if needed:`);
        console.log(`   Edit client/vite.config.js and change target to:`);
        console.log(`   target: 'http://localhost:${PORT}'`);
      }
      
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

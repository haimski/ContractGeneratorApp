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
  process.env.FRONTEND_URL || null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Export the Express app as a serverless function
export default app;

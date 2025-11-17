import { useState, useEffect } from 'react';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';

// Configure axios defaults
axios.defaults.withCredentials = true;

// In production (Vercel), use relative paths - API is at /api/* on same domain
// In development, Vite proxy handles /api/* requests
// Only set baseURL if explicitly provided via env variable
if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}
// If no baseURL is set, axios uses relative paths which work for both:
// - Development: Vite proxy forwards /api/* to backend
// - Production: Vercel routes /api/* to serverless functions

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [webhookUrl, setWebhookUrl] = useState('');

  // Check if webhook exists in session on mount
  useEffect(() => {
    checkWebhookSession();
  }, []);

  const checkWebhookSession = async () => {
    try {
      const response = await axios.get('/api/webhook');
      if (response.data.success && response.data.webhook_url) {
        setWebhookUrl(response.data.webhook_url);
        setCurrentPage('form');
      }
    } catch (error) {
      // No webhook in session, stay on home page
      console.log('No webhook in session');
    }
  };

  const handleWebhookSubmit = async (url) => {
    try {
      const response = await axios.post('/api/webhook', { webhook_url: url });
      if (response.data.success) {
        setWebhookUrl(url);
        setCurrentPage('form');
      }
    } catch (error) {
      console.error('Webhook submit error:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        const isProduction = import.meta.env.PROD;
        if (isProduction) {
          throw new Error('Cannot connect to API. Please check your Vercel deployment logs or try refreshing the page.');
        } else {
          throw new Error('Cannot connect to server. Make sure the backend server is running on port 5001 (or check console for the actual port).');
        }
      }
      throw new Error(error.response?.data?.message || 'Failed to save webhook');
    }
  };

  const handleChangeWebhook = async () => {
    try {
      await axios.delete('/api/webhook');
      setWebhookUrl('');
      setCurrentPage('home');
    } catch (error) {
      console.error('Error clearing webhook:', error);
    }
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onWebhookSubmit={handleWebhookSubmit} />
      )}
      {currentPage === 'form' && (
        <FormPage 
          webhookUrl={webhookUrl} 
          onChangeWebhook={handleChangeWebhook} 
        />
      )}
      <Analytics />
    </>
  );
}

export default App;

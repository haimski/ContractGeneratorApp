import { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Only set baseURL if not using Vite dev server (production)
if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
}

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
    </>
  );
}

export default App;

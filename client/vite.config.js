import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: false, // Allow Vite to try next port if 3000 is taken
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('❌ Proxy error:', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('📤 Sending Request to Backend:', req.method, req.url, '→', env.VITE_API_URL || 'http://localhost:5000');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📥 Received Response from Backend:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    }
  }
})

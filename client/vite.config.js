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
          // Default to 5001 (common on macOS when 5000 is taken by AirPlay)
          // Can be overridden with VITE_API_URL env variable
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('❌ Proxy error:', err.message);
              console.log('💡 Tip: Backend server might be on a different port.');
              console.log('   Check server console for the actual port, then set VITE_API_URL in client/.env');
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              const target = env.VITE_API_URL || 'http://localhost:5001';
              console.log('📤 Sending Request to Backend:', req.method, req.url, '→', target);
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

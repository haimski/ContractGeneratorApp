# 📊 Vercel Analytics Setup

Quick guide to enable Vercel Analytics in your Quote Generator app.

---

## Step 1: Install Analytics Package

```bash
cd client
npm install @vercel/analytics
```

---

## Step 2: Update main.jsx

Open `client/src/main.jsx` and add the Analytics component:

### Before:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### After:
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
```

---

## Step 3: Commit and Deploy

```bash
git add .
git commit -m "Add Vercel Analytics"
git push
```

Vercel will automatically redeploy with analytics enabled.

---

## Step 4: View Analytics

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Click "Analytics" tab
4. View real-time data:
   - Page views
   - Unique visitors
   - Top pages
   - Geographic data
   - Device types

---

## Optional: Speed Insights

For performance monitoring, also add Speed Insights:

```bash
npm install @vercel/speed-insights
```

Update `main.jsx`:

```javascript
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>,
)
```

---

## That's it! 🎉

Your app now tracks:
- ✅ Page views
- ✅ User sessions
- ✅ Geographic data
- ✅ Device information
- ✅ Performance metrics (with Speed Insights)

All data is available in your Vercel Dashboard.

# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ❌ Issue: 403 Forbidden Error on /api/webhook

**Symptoms:**
```
Request URL: http://localhost:3000/api/webhook
Request Method: POST
Status Code: 403 Forbidden
```

**Causes:**
1. Backend server is not running
2. CORS configuration issue
3. Vite proxy not working correctly

**Solutions:**

#### Solution 1: Ensure Backend is Running

**Check if backend is running:**
```bash
# Open a new terminal
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{"status":"ok","message":"Quote Generator API is running"}
```

**If you get "Connection refused":**
```bash
# Start the backend server
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/server
npm run dev
```

#### Solution 2: Restart Both Servers

Sometimes the servers need a fresh restart:

```bash
# Stop both servers (Ctrl+C in each terminal)

# Terminal 1 - Start Backend
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/server
npm run dev

# Terminal 2 - Start Frontend (wait for backend to start first)
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/client
npm run dev
```

#### Solution 3: Check Port Numbers

Make sure you're using the correct ports:

**Backend should show:**
```
🚀 Quote Generator Server running on http://localhost:5000
```

**Frontend should show:**
```
➜  Local:   http://localhost:3000/
```

**If ports are different:**
- Note the backend port (e.g., 5001)
- Create `.env` file in client folder:
```bash
cd client
echo "VITE_API_URL=http://localhost:5001" > .env
```
- Restart frontend

#### Solution 4: Clear Browser Cache

```bash
# In browser:
1. Open DevTools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"
```

#### Solution 5: Check CORS Configuration

Verify backend CORS is configured correctly:

**File:** `server/server.js` (lines 41-52)

Should include your frontend port:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // ... more ports
];
```

---

### ❌ Issue: "Cannot GET /api/webhook"

**Cause:** Backend server is not running

**Solution:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/server
npm run dev
```

---

### ❌ Issue: "Failed to fetch"

**Symptoms:**
- API calls fail
- Network errors in console

**Solutions:**

1. **Check both servers are running**
2. **Check firewall settings** - Allow connections to ports 3000 and 5000
3. **Try direct backend URL:**
   ```bash
   curl http://localhost:5000/api/health
   ```

---

### ❌ Issue: Session Not Saved

**Symptoms:**
- Webhook URL not persisting
- Redirected back to home page after refresh

**Solutions:**

1. **Clear cookies:**
   - Open DevTools (F12)
   - Application tab → Cookies
   - Delete all cookies for localhost

2. **Check backend session configuration:**
   - File: `server/server.js`
   - Session should be configured with `httpOnly: true`

3. **Ensure axios is sending credentials:**
   - File: `client/src/App.jsx`
   - Should have: `axios.defaults.withCredentials = true`

---

### ❌ Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

✅ **Good news!** The app has automatic port detection.

**Backend:** Will automatically use 5001, 5002, etc.
**Frontend:** Will automatically use 3001, 3002, etc.

**Check console output** to see which port is being used.

**Manual fix (if needed):**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
lsof -ti:5000 | xargs kill -9
```

---

### ❌ Issue: Vite Proxy Not Working

**Symptoms:**
- API calls to `/api/*` return 404
- Proxy errors in console

**Solutions:**

1. **Check Vite config:**
   ```javascript
   // client/vite.config.js
   proxy: {
     '/api': {
       target: 'http://localhost:5000',
       changeOrigin: true,
     }
   }
   ```

2. **Restart Vite dev server:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

3. **Check proxy logs:**
   - Vite config now includes logging
   - Check terminal for proxy messages

---

### ❌ Issue: Environment Variables Not Working

**Symptoms:**
- Custom `VITE_API_URL` not being used

**Solutions:**

1. **Create `.env` file in client folder:**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Edit `.env`:**
   ```env
   VITE_API_URL=http://localhost:5001
   ```

3. **Restart Vite:**
   ```bash
   npm run dev
   ```

**Note:** Vite only reads `.env` files on startup!

---

### ❌ Issue: Blank Page

**Symptoms:**
- Browser shows blank page
- No errors visible

**Solutions:**

1. **Open DevTools Console (F12)**
   - Check for JavaScript errors

2. **Check if React is loading:**
   - Look for `<div id="root">` in Elements tab
   - Should have React content inside

3. **Clear cache and reload:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

4. **Check Vite is serving files:**
   ```bash
   # Should see Vite output
   npm run dev
   ```

---

### ❌ Issue: Hebrew Text Looks Weird

**Symptoms:**
- Hebrew characters display incorrectly
- Text direction is wrong

**Solutions:**

1. **Check HTML lang attribute:**
   ```html
   <html lang="he" dir="rtl">
   ```

2. **Install Hebrew fonts:**
   - The app uses system fonts
   - Should work on most systems

3. **Check browser encoding:**
   - Should be UTF-8

---

## 🧪 Testing Checklist

Use this checklist to verify everything is working:

### Backend Tests

- [ ] Backend starts without errors
- [ ] Port is displayed in console
- [ ] Health endpoint works: `curl http://localhost:5000/api/health`
- [ ] Returns JSON: `{"status":"ok",...}`

### Frontend Tests

- [ ] Frontend starts without errors
- [ ] Port is displayed in console
- [ ] Home page loads at `http://localhost:3000`
- [ ] Can see Hebrew text and logo
- [ ] No console errors in DevTools

### Integration Tests

- [ ] Can enter webhook URL
- [ ] Can click "המשך לטופס ←" button
- [ ] Redirects to form page
- [ ] Form page loads correctly
- [ ] Can select pricing model
- [ ] Can fill form fields
- [ ] Can generate preview
- [ ] Can submit to Make.com

### Session Tests

- [ ] Webhook URL persists after refresh
- [ ] Can change webhook URL
- [ ] Session expires after 24 hours

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**Backend:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

**Frontend:**
```javascript
// Add to App.jsx
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try the action that's failing
4. Check:
   - Request URL
   - Request Method
   - Status Code
   - Response Headers
   - Response Body

### Check Console Tab

1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - Red errors
   - Yellow warnings
   - Network errors
   - CORS errors

---

## 📞 Still Having Issues?

### Quick Diagnostic

Run this command to check everything:

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check if frontend is running
curl http://localhost:3000

# Check ports in use
lsof -i :5000
lsof -i :3000
```

### Collect Information

Before asking for help, collect:

1. **Console output** from backend terminal
2. **Console output** from frontend terminal
3. **Browser console errors** (F12 → Console)
4. **Network tab** errors (F12 → Network)
5. **Which step** is failing

### Clean Restart

Try a complete clean restart:

```bash
# Stop all servers (Ctrl+C)

# Clear node_modules and reinstall (if needed)
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install

# Start fresh
cd ../server && npm run dev
cd ../client && npm run dev
```

---

## ✅ Success Indicators

You know everything is working when:

- ✅ Backend shows: `🚀 Quote Generator Server running on http://localhost:5000`
- ✅ Frontend shows: `➜  Local:   http://localhost:3000/`
- ✅ Home page loads with Hebrew text
- ✅ Can enter webhook and proceed to form
- ✅ No errors in browser console
- ✅ No errors in terminal

---

**For more help, see:**
- [START_HERE.md](./START_HERE.md) - Setup guide
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [PORT_DETECTION.md](./PORT_DETECTION.md) - Port issues

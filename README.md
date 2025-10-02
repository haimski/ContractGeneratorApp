# מחולל הצעות מחיר - MERN Stack Version

## 🚀 תיאור המערכת
מערכת MERN Stack (MongoDB, Express, React, Node.js) ליצירת הצעות מחיר מקצועיות עם אינטגרציה ל-Make.com.

זוהי גרסת MERN של האפליקציה המקורית ב-PHP, עם אותה פונקציונליות ועיצוב בדיוק.

## 📁 מבנה הפרויקט

```
congen-mern/
├── server/              # Backend - Node.js + Express
│   ├── server.js       # Main server file
│   └── package.json    # Server dependencies
├── client/             # Frontend - React + Vite
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── styles/     # CSS files
│   │   └── App.jsx     # Main app component
│   ├── public/         # Static files
│   └── package.json    # Client dependencies
└── README.md
```

## 🛠️ טכנולוגיות

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Express-Session** - Session management
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (fast development)
- **Axios** - API calls
- **CSS3** - Styling (matching PHP version exactly)

## 📦 התקנה

### דרישות מקדימות
- Node.js 16+ ו-npm מותקנים במערכת
- חיבור אינטרנט (לשליחה ל-Make.com)

### שלב 1: התקן את ה-Backend

```bash
cd congen-mern/server
npm install
```

### שלב 2: התקן את ה-Frontend

```bash
cd ../client
npm install
```

## 🚀 הרצת האפליקציה

### אופציה 1: הרצה ידנית (2 טרמינלים)

**טרמינל 1 - Backend:**
```bash
cd congen-mern/server
npm run dev
```
השרת יעלה על: `http://localhost:5000`

**טרמינל 2 - Frontend:**
```bash
cd congen-mern/client
npm run dev
```
האפליקציה תעלה על: `http://localhost:3000`

### אופציה 2: הרצה בפרודקשן

**Build Frontend:**
```bash
cd congen-mern/client
npm run build
```

**הרץ Backend:**
```bash
cd ../server
npm start
```

## 🎯 איך להשתמש?

### 1. פתח את האפליקציה
גלוש אל: `http://localhost:3000`

### 2. הזן Webhook URL
- במסך הראשון, הזן את כתובת ה-Webhook שקיבלת מ-Make.com
- הכתובת צריכה להיות בפורמט: `https://hook.*.make.com/...`
- ה-Webhook נשמר ב-Session ולא צריך להזין אותו שוב

### 3. מלא את הטופס
- בחר מודל תמחור:
  - **Fixed** - פרויקט קבוע
  - **Discovery** - אפיון בתשלום → פרויקט
  - **Hours** - בנק שעות (Retainer)
- מלא את כל הפרטים הנדרשים
- צור תצוגה מקדימה
- שלח את הטופס ל-Make

### 4. פעולות נוספות
- **העתק ל-Clipboard** - העתק את ה-HTML של התצוגה
- **הדפס/שמור כ-PDF** - הדפס או שמור כקובץ PDF
- **שלח משוב** - שלח משוב על האפליקציה
- **שנה Webhook** - החלף את כתובת ה-Webhook

## ✅ בדיקת תקינות (Test Checklist)

### Test 1: Backend Health Check
פתח בדפדפן: `http://localhost:5000/api/health`

**Expected:** 
```json
{"status":"ok","message":"Quote Generator API is running"}
```

### Test 2: Home Page
פתח בדפדפן: `http://localhost:3000`

**Expected:** דף הבית עם טקסט עברי ו-dark theme

### Test 3: Enter Webhook
1. הזן webhook לדוגמה: `https://hook.eu2.make.com/test123`
2. לחץ "המשך לטופס ←"
3. אמור להיות redirect לדף הטופס

### Test 4: Form Page
**Expected to see:**
- Header: "מחולל הצעת מחיר לאוטומציה"
- שני כרטיסים: "פרטי בסיס" ו-"בחירת מודל תמחור"
- כפתורים: "שנה Webhook" ו-"💬 משוב"

### Test 5: Select Model
1. בחר "פרויקט קבוע (Fixed)" מה-dropdown
2. כרטיס חדש אמור להופיע עם שדות Fixed
3. נסה מודלים אחרים (Discovery, Hours)

### Test 6: Preview
1. מלא מידע בסיסי (שם לקוח, מספר הצעה וכו')
2. בחר מודל ומלא את השדות שלו
3. לחץ "צור תצוגה מקדימה"
4. התצוגה המקדימה אמורה להופיע בתחתית

### Test 7: Feedback Modal
1. לחץ על כפתור "💬 משוב"
2. המודל אמור להיפתח
3. מלא את הטופס ושלח
4. הודעת הצלחה אמורה להופיע

## 🎨 מפרט עיצוב

### Color Scheme
- **Background:** Dark gradient (blue-black)
- **Cards:** Dark blue with subtle borders
- **Text:** Light gray/white
- **Accent:** Blue (#7c9cff)
- **Success:** Green (#3ddc97)
- **Warning:** Yellow (#ffbd59)
- **Danger:** Red (#ff6b6b)

### Layout
- **RTL (Right-to-Left)** Hebrew interface
- **Responsive** design
- **Modern** rounded corners and shadows
- **Clean** spacing and typography

## 🔧 API Endpoints

### Backend API (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/webhook` | Set webhook URL in session |
| GET | `/api/webhook` | Get webhook URL from session |
| DELETE | `/api/webhook` | Clear webhook URL |
| POST | `/api/submit-quote` | Submit quote to Make.com |
| POST | `/api/submit-feedback` | Submit feedback to Make.com |

## ✨ תכונות

✅ **SPA (Single Page Application)** - ניווט מהיר ללא רענון דף  
✅ **Session Management** - ה-Webhook נשמר בסשן  
✅ **RTL Support** - תמיכה מלאה בעברית מימין לשמאל  
✅ **3 מודלי תמחור** - Fixed, Discovery, Hours  
✅ **תצוגה מקדימה** - צפייה לפני שליחה  
✅ **הדפסה/PDF** - ייצוא להדפסה או PDF  
✅ **העתקה ל-Clipboard** - העתק HTML  
✅ **משוב** - שליחת משוב למפתחים  
✅ **אבטחה** - וולידציה של URLs  
✅ **עיצוב מודרני** - Dark theme עם גרדיאנטים  

## 🔒 אבטחה

- כל ה-URLs מסוננים ומאומתים
- הגנה מפני XSS
- וולידציה של פורמט Webhook של Make
- CORS מוגדר רק ל-localhost:3000
- Sessions מאובטחים עם httpOnly cookies

## 🆚 הבדלים מגרסת PHP

| Feature | PHP Version | MERN Version |
|---------|-------------|--------------|
| Architecture | Multi-page | Single Page App (SPA) |
| Backend | PHP + Sessions | Node.js + Express + Sessions |
| Frontend | HTML + Vanilla JS | React + JSX |
| Build Tool | None | Vite |
| Hot Reload | No | Yes |
| API | Form POST | RESTful API |
| State Management | DOM | React State (Hooks) |

## 📝 הערות

- **MongoDB לא מותקן** - האפליקציה משתמשת רק ב-Sessions, לא במסד נתונים
- אם תרצה להוסיף MongoDB בעתיד (שמירת היסטוריה, משתמשים וכו'), זה קל להוסיף
- הפרויקט **מבודד לחלוטין** מגרסת ה-PHP ולא משפיע עליה

## 🐛 פתרון בעיות

### הפורטים תפוסים?
💡 **Automatic Port Detection מופעל!**
- אם פורט 5000 תפוס, השרת יעבור אוטומטית ל-5001, 5002 וכו'
- אם פורט 3000 תפוס, Vite יעבור אוטומטית ל-3001, 3002 וכו'
- בדוק את הקונסול לראות איזה פורט נבחר

**לשינוי ידני:**
- **Backend**: ערוך `server/server.js` - שנה `PORT = 5000`
- **Frontend**: ערוך `client/vite.config.js` - שנה `port: 3000`

**לסגירת תהליך תפוס:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors?
ודא ש:
- Backend רץ על פורט 5000
- Frontend רץ על פורט 3000
- שני השרתים פועלים במקביל

### Session לא נשמר?
- ודא שהדפדפן מאפשר cookies
- בדוק ש-`axios.defaults.withCredentials = true` מוגדר

### דף ריק (Blank Page)?
1. פתח Developer Tools (F12)
2. בדוק את ה-Console לשגיאות
3. ודא ששני השרתים רצים

### "Cannot GET /api/webhook"?
ה-Backend לא רץ. הרץ `npm run dev` בתיקיית `server/`

### "Failed to fetch"?
- ודא ש-Backend רץ
- ודא ש-Frontend רץ
- בדוק שאין חומת אש חוסמת

## 🚀 Deployment to Vercel

This project is configured for easy deployment to Vercel with serverless functions.

### Quick Deploy

1. **Push to GitHub**
2. **Import to Vercel** - Connect your repository
3. **Set environment variables** - Add `SESSION_SECRET`
4. **Deploy!** - Automatic build and deployment

### Detailed Instructions

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step deployment guide including:
- Environment setup
- Vercel configuration
- Analytics integration
- Custom domain setup
- Troubleshooting

### ⚠️ Production Note

The current setup uses **in-memory sessions** which work for demo/testing but have limitations on serverless platforms. For production with multiple users, consider:
- Implementing Redis session store
- Using JWT tokens
- Or client-side localStorage

---

## 📞 תמיכה

נוצר עבור **Automation School** 🚀

---

**Happy Coding!** 💻

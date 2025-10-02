# 🚀 Quick Start Guide

## התקנה מהירה (פעם אחת בלבד)

### שלב 1: התקן את כל התלויות

פתח טרמינל בתיקיית הפרויקט והרץ:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern
npm run install-all
```

זה יתקין את כל החבילות הנדרשות עבור Backend ו-Frontend.

---

## הרצת האפליקציה

### אופציה 1: שני טרמינלים (מומלץ)

**טרמינל 1 - הרץ את ה-Backend:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/server
npm run dev
```

תראה הודעה:
```
🚀 Quote Generator Server running on http://localhost:5000
📡 API endpoints available at http://localhost:5000/api
```

> 💡 **Auto Port Detection:** If port 5000 is in use, the server will automatically try 5001, 5002, etc.

**טרמינל 2 - הרץ את ה-Frontend:**
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/congen-mern/client
npm run dev
```

תראה הודעה:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

> 💡 **Auto Port Detection:** If port 3000 is in use, Vite will automatically try 3001, 3002, etc.

**עכשיו פתח דפדפן וגלוש ל:** `http://localhost:3000` (or the port shown in the console)

---

## בדיקה מהירה

### 1. בדוק שה-Backend עובד:
פתח בדפדפן: `http://localhost:5000/api/health`

אמור להציג:
```json
{"status":"ok","message":"Quote Generator API is running"}
```

### 2. בדוק שה-Frontend עובד:
פתח בדפדפן: `http://localhost:3000`

אמור לראות את דף הבית עם כותרת: **"🚀 מחולל הצעות מחיר"**

---

## שימוש באפליקציה

### שלב 1: הזן Webhook
1. בדף הבית, הזן את כתובת ה-Webhook מ-Make.com
2. לחץ "המשך לטופס ←"

### שלב 2: מלא טופס
1. מלא את פרטי הבסיס (שם לקוח, מספר הצעה וכו')
2. בחר מודל תמחור (Fixed/Discovery/Hours)
3. מלא את השדות הספציפיים למודל

### שלב 3: צור תצוגה
1. לחץ "צור תצוגה מקדימה"
2. בדוק את התצוגה בתחתית הדף

### שלב 4: שלח או ייצא
- **שלח לטיפול (Make)** - שולח ל-Make.com
- **העתקה ל-Clipboard** - מעתיק HTML
- **הדפס / שמור כ-PDF** - מדפיס או שומר

---

## עצירת האפליקציה

בכל טרמינל, לחץ: `Ctrl + C`

---

## פתרון בעיות נפוצות

### ❌ "Port 5000 is already in use"
✅ **No problem!** The server has automatic port detection and will use 5001, 5002, etc.
- Check the console output to see which port is being used
- Open the URL shown in the console

### ❌ "Port 3000 is already in use"
✅ **No problem!** Vite has automatic port detection and will use 3001, 3002, etc.
- Check the console output to see which port is being used
- Open the URL shown in the console

### ❌ "Cannot GET /api/webhook"
ה-Backend לא רץ. ודא שהרצת `npm run dev` בתיקיית `server/`

### ❌ "Failed to fetch"
- ודא ש-Backend רץ על פורט 5000
- ודא ש-Frontend רץ על פורט 3000
- בדוק שאין חומת אש חוסמת

### ❌ "Session not saved"
- נקה cookies בדפדפן
- רענן את הדף
- ודא ש-Backend רץ

---

## טיפים שימושיים

### 💡 פיתוח מהיר
- שני השרתים תומכים ב-**Hot Reload**
- שינויים בקוד יתעדכנו אוטומטית
- אין צורך לרענן ידנית

### 💡 בדיקת API
השתמש ב-Postman או curl לבדוק endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Set webhook
curl -X POST http://localhost:5000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"webhook_url":"https://hook.eu2.make.com/test"}'
```

### 💡 לוגים
- **Backend logs**: יופיעו בטרמינל של ה-Backend
- **Frontend logs**: פתח Developer Tools (F12) בדפדפן

---

## מה הלאה?

- 📖 קרא את [README.md](../README.md) למידע מפורט
- 🔧 התאם אישית את העיצוב ב-`client/src/styles/`
- 🚀 הוסף פיצ'רים חדשים ב-`client/src/components/`
- 💾 הוסף MongoDB אם צריך שמירת נתונים

---

**זהו! האפליקציה שלך מוכנה לשימוש** 🎉

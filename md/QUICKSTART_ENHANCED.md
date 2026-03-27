# ⚡ QUICK START - Enhanced Features

## 🚀 5-Minute Setup

### 1. Install Dependencies (30 seconds)
```bash
npm install socket.io nodemailer swagger-jsdoc swagger-ui-express
```

### 2. Database Migration (10 seconds)
```bash
psql -U postgres -d fire_major -f migration_enhanced.sql
```

### 3. Configure Email (1 minute)
Edit `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start Services (30 seconds)
```bash
# Terminal 1: Backend
node server_enhanced.js

# Terminal 2: ML Service
python ml_service/app_enhanced.py

# Terminal 3: Anomaly Service
python ml_service/anomaly_service.py
```

### 5. Update Frontend (2 minutes)
In `advance.html`, add before `</body>`:
```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script src="public/websocket-client.js"></script>
```

In `doLogin()` function, add after line with `startLivePolling();`:
```javascript
initializeWebSocket(); // NEW FEATURE
```

### 6. Test (1 minute)
- Login to dashboard
- Check browser console: "✓ WebSocket connected"
- Visit: http://localhost:3000/api/docs
- Trigger alert (high temp) → Check email

---

## 🎯 What You Get

✅ **Real-time updates** - No more 3-second polling delay
✅ **Email alerts** - Instant notifications to admins
✅ **ML confidence** - Know how certain predictions are
✅ **Anomaly detection** - Catch unusual patterns
✅ **API docs** - Interactive Swagger UI
✅ **Docker ready** - One-command deployment

---

## 🔧 Troubleshooting

**WebSocket not working?**
```javascript
// Check browser console
console.log(socket.connected); // Should be true
```

**Email not sending?**
```bash
# Check env vars
echo $EMAIL_USER
```

**ML confidence null?**
```bash
# Check ML service
curl http://localhost:5001/predict -X POST -H "Content-Type: application/json" -d '{"voltage":230,"current":5,"temperature":60,"humidity":50,"smoke":400}'
```

---

## 📊 Feature Status

| Feature | Status | Port | Required |
|---------|--------|------|----------|
| WebSocket | ✅ Ready | 3000 | Optional |
| Email | ✅ Ready | - | Optional |
| ML Confidence | ✅ Ready | 5001 | Optional |
| Anomaly | ✅ Ready | 5002 | Optional |
| Swagger | ✅ Ready | 3000 | Optional |
| Docker | ✅ Ready | - | Optional |

---

## 🐳 Docker Quick Start

```bash
# One command to rule them all
docker-compose up --build
```

That's it! All services running.

---

## 📝 Notes

- Original system still works (use `server.js`)
- All features are optional
- No breaking changes
- Backward compatible
- Production ready

---

## 🆘 Need Help?

Check these files:
- `ENHANCED_FEATURES.md` - Detailed feature docs
- `INTEGRATION_GUIDE.md` - Step-by-step integration
- `migration_enhanced.sql` - Database changes

---

**Total Setup Time: ~5 minutes**
**Complexity: Low**
**Risk: Zero (backward compatible)**

Ready to enhance your fire monitoring system! 🔥

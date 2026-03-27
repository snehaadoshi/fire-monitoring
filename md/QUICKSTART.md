# 🚀 QUICK START GUIDE - Enhanced Fire Monitoring System

## For New Installations

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Using PostgreSQL locally
psql -U postgres -d fire -f schema.sql

# OR using Neon (run schema.sql in Neon console)
```

### 3. Configure Environment
Create `.env` file:
```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_random_secret_key_here
PORT=3000
```

### 4. Start Server
```bash
npm start
```

### 5. Access Dashboard
Open browser: `https://fire-monitoring.onrender.com`

---

## For Existing Installations (Upgrade)

### 1. Backup Your Database
```bash
pg_dump -U postgres fire > backup_before_upgrade.sql
```

### 2. Run Migration
```bash
psql -U postgres -d fire -f migration.sql
```

### 3. Install New Dependencies
```bash
npm install
```

### 4. Update Environment
Add to your `.env`:
```env
JWT_SECRET=your_random_secret_key_here
```

### 5. Restart Server
```bash
npm start
```

---

## 🎯 First Time Setup

### Create Admin User
1. Click "Add User" on login page
2. Fill in details:
   - Full Name: Your Name
   - Email: admin@example.com
   - Password: (secure password)
   - Role: **Admin**
   - Site Name: Your Site
   - Module Count: 35 (or your count)
3. Click "Add User"
4. Login with credentials

---

## 🧪 Test New Features

### Test 1: Alert System
```bash
# Send test data with high temperature
curl -X POST https://fire-monitoring.onrender.com/api/sensor \
  -H "Content-Type: application/json" \
  -d '{
    "module_no": 1,
    "voltage": 5.0,
    "current": 2.5,
    "temperature": 60,
    "humidity": 45,
    "smoke": 350
  }'
```
✅ Check dashboard - Module 1 should glow red with alert badge

### Test 2: View Alerts
1. Click "🚨 Alerts" button
2. See the alert logged
3. Click "Clear Alert"

### Test 3: View Graph
1. Double-click any module block
2. Graph modal appears with historical data

### Test 4: System Health
- Check left panel for health statistics
- Should show active modules and alerts

---

## 📱 Quick Feature Access

| Feature | How to Access |
|---------|---------------|
| **Alert History** | Click "🚨 Alerts" button (top-right) |
| **Module Graph** | Double-click module OR click "📊 View Graph" |
| **System Health** | Auto-displayed in left panel |
| **Emergency Contacts** | Click "📞" button |
| **Add User** | Login page → "Add User" button |
| **Download Logs** | Control Panel → "Download System Logs" |

---

## 🔧 Configuration

### Alert Thresholds (in advance.html)
```javascript
let alertThresholds = {
    temperature: 50,    // °C
    smoke: 300,         // ppm
    voltageMin: 3.0,    // V
    voltageMax: 5.5     // V
};
```

### Polling Intervals
```javascript
// Sensor data: 3 seconds
window.liveInterval = setInterval(fetchLiveSensorData, 3000);

// System health: 10 seconds
window.healthInterval = setInterval(updateSystemHealth, 10000);
```

---

## 🐛 Common Issues

### Issue: "Cannot connect to database"
**Solution**: Check DATABASE_URL in .env file

### Issue: "JWT secret not configured"
**Solution**: Add JWT_SECRET to .env file

### Issue: "Alerts not showing"
**Solution**: Run migration.sql to create alerts table

### Issue: "Graphs not loading"
**Solution**: Ensure Chart.js CDN is accessible

---

## 📊 Default Credentials

**For Testing Only** (Change in production):
- Email: admin@example.com
- Password: (set during user creation)
- Role: Admin

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET in .env
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Review user roles and permissions

---

## 📞 Need Help?

1. Check ENHANCED_README.md for detailed docs
2. Review troubleshooting section
3. Check server logs: `npm start`
4. Verify database connection

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Can login successfully
- [ ] Dashboard displays modules
- [ ] System health shows statistics
- [ ] Can view alert history page
- [ ] Can double-click module to see graph
- [ ] Alert indicators work (test with high temp)
- [ ] Can add new users
- [ ] Can download logs

---

**Setup Time**: ~10 minutes
**Difficulty**: Easy
**Support**: Check ENHANCED_README.md

🎉 **You're all set! Enjoy your enhanced fire monitoring system!**

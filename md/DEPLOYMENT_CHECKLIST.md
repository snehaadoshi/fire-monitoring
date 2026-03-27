# ✅ DEPLOYMENT CHECKLIST - Enhanced Features

## PRE-DEPLOYMENT

### 1. Review Documentation
- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Read `ENHANCED_FEATURES.md`
- [ ] Read `INTEGRATION_GUIDE.md`
- [ ] Review `ARCHITECTURE_DIAGRAM.md`

### 2. Backup Current System
- [ ] Backup database: `pg_dump fire_major > backup.sql`
- [ ] Backup `.env` file
- [ ] Commit current code to git
- [ ] Test current system works

---

## INSTALLATION

### 3. Install Dependencies
```bash
npm install socket.io nodemailer swagger-jsdoc swagger-ui-express
```
- [ ] Dependencies installed successfully
- [ ] No errors in npm install

### 4. Database Migration
```bash
psql -U postgres -d fire_major -f migration_enhanced.sql
```
- [ ] Migration executed successfully
- [ ] New columns added: ml_confidence, anomaly_score, is_anomaly
- [ ] Indexes created
- [ ] No errors

### 5. Environment Configuration
```bash
cp .env.example .env
```
Edit `.env`:
- [ ] DATABASE_URL configured
- [ ] JWT_SECRET set
- [ ] EMAIL_HOST set (e.g., smtp.gmail.com)
- [ ] EMAIL_PORT set (e.g., 587)
- [ ] EMAIL_USER set
- [ ] EMAIL_PASS set (use app password for Gmail)

---

## BACKEND SETUP

### 6. Test Enhanced Server
```bash
node server_enhanced.js
```
- [ ] Server starts without errors
- [ ] Port 3000 listening
- [ ] WebSocket initialized message
- [ ] Email service status logged
- [ ] Swagger docs available at /api/docs

### 7. Test ML Service (Enhanced)
```bash
cd ml_service
python app_enhanced.py
```
- [ ] Service starts on port 5001
- [ ] Model loaded successfully
- [ ] Label encoder loaded
- [ ] Test prediction:
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"voltage":230,"current":5,"temperature":60,"humidity":50,"smoke":400}'
```
- [ ] Returns fire_risk and confidence

### 8. Test Anomaly Service
```bash
cd ml_service
python anomaly_service.py
```
- [ ] Service starts on port 5002
- [ ] Model initialized
- [ ] Test detection:
```bash
curl -X POST http://localhost:5002/detect \
  -H "Content-Type: application/json" \
  -d '{"voltage":230,"current":5,"temperature":60,"humidity":50,"smoke":400}'
```
- [ ] Returns is_anomaly and anomaly_score

---

## FRONTEND INTEGRATION

### 9. Update advance.html
Add before `</body>`:
```html
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>
<script src="public/websocket-client.js"></script>
```
- [ ] Scripts added
- [ ] No syntax errors

### 10. Modify doLogin() Function
Add after `startLivePolling();`:
```javascript
try {
    initializeWebSocket();
} catch (e) {
    console.log('WebSocket disabled');
}
```
- [ ] Code added
- [ ] No syntax errors

### 11. Enhance showParams() Function
Add ML confidence and anomaly display:
```javascript
if (row.ml_confidence) {
    displayRows.push({ 
        name: '🎯 ML Confidence', 
        val: (row.ml_confidence * 100).toFixed(1) + '%' 
    });
}
```
- [ ] Code added
- [ ] No syntax errors

---

## TESTING

### 12. Test WebSocket Connection
- [ ] Login to dashboard
- [ ] Open browser console
- [ ] See "✓ WebSocket connected" message
- [ ] Check `socket.connected` returns true

### 13. Test Real-Time Updates
- [ ] Send sensor data via API
- [ ] Dashboard updates without refresh
- [ ] No polling delay

### 14. Test Email Alerts
- [ ] Trigger HIGH alert (temp > 50°C)
- [ ] Check admin email inbox
- [ ] Email received with correct details
- [ ] Email format correct

### 15. Test ML Confidence
- [ ] Send sensor data
- [ ] Check database: `SELECT ml_confidence FROM sensor_data ORDER BY id DESC LIMIT 1;`
- [ ] Confidence value present (0-1)
- [ ] Display in parameter panel

### 16. Test Anomaly Detection
- [ ] Send sensor data
- [ ] Check database: `SELECT anomaly_score, is_anomaly FROM sensor_data ORDER BY id DESC LIMIT 1;`
- [ ] Anomaly score present
- [ ] Alert created if score > 0.5

### 17. Test Swagger Docs
- [ ] Visit http://localhost:3000/api/docs
- [ ] Swagger UI loads
- [ ] All endpoints documented
- [ ] Can test endpoints

### 18. Test Docker (Optional)
```bash
docker-compose up --build
```
- [ ] All containers start
- [ ] Backend accessible on port 3000
- [ ] ML service accessible on port 5001
- [ ] Anomaly service accessible on port 5002
- [ ] No errors in logs

---

## VALIDATION

### 19. End-to-End Test
- [ ] Login works
- [ ] Dashboard displays modules
- [ ] Click module shows parameters
- [ ] ML confidence displayed
- [ ] Anomaly score displayed
- [ ] Real-time updates work
- [ ] Alerts page works
- [ ] Email received for critical alert
- [ ] Swagger docs accessible
- [ ] All existing features work

### 20. Performance Check
- [ ] Page load time acceptable
- [ ] WebSocket latency < 100ms
- [ ] ML prediction < 2s
- [ ] Anomaly detection < 2s
- [ ] No memory leaks
- [ ] CPU usage normal

### 21. Error Handling
- [ ] Stop ML service → System continues (fallback)
- [ ] Stop anomaly service → System continues
- [ ] Invalid email config → No crash
- [ ] WebSocket disconnect → Polling works
- [ ] Database error → Graceful error message

---

## ROLLBACK PLAN

### 22. Prepare Rollback
If issues occur:
- [ ] Stop enhanced server
- [ ] Start original server: `node server.js`
- [ ] Remove WebSocket scripts from HTML
- [ ] System works as before
- [ ] Restore database backup if needed

---

## PRODUCTION DEPLOYMENT

### 23. Production Checklist
- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] Team trained on new features
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan tested

### 24. Deploy to Production
- [ ] Upload new files to server
- [ ] Run migration on production DB
- [ ] Configure production .env
- [ ] Start services with PM2 or Docker
- [ ] Verify all features work
- [ ] Monitor logs for errors

### 25. Post-Deployment
- [ ] Monitor system for 24 hours
- [ ] Check email alerts working
- [ ] Verify WebSocket connections stable
- [ ] Review ML prediction accuracy
- [ ] Check anomaly detection alerts
- [ ] Gather user feedback

---

## MONITORING

### 26. Setup Monitoring
- [ ] WebSocket connection count
- [ ] Email delivery rate
- [ ] ML service uptime
- [ ] Anomaly service uptime
- [ ] API response times
- [ ] Error rates

### 27. Alerts
- [ ] Alert if ML service down > 5 min
- [ ] Alert if anomaly service down > 5 min
- [ ] Alert if email delivery fails
- [ ] Alert if WebSocket connections drop

---

## DOCUMENTATION

### 28. Update Documentation
- [ ] Update README.md with new features
- [ ] Document environment variables
- [ ] Add troubleshooting guide
- [ ] Create user manual for new features
- [ ] Update API documentation

---

## SIGN-OFF

### 29. Final Approval
- [ ] Technical lead approval
- [ ] QA team approval
- [ ] Product owner approval
- [ ] Security review passed
- [ ] Performance benchmarks met

### 30. Go Live
- [ ] Production deployment complete
- [ ] All services running
- [ ] Monitoring active
- [ ] Team notified
- [ ] Users informed of new features

---

## SUCCESS CRITERIA

✅ All 6 features working
✅ Zero downtime during deployment
✅ No breaking changes
✅ Existing features unchanged
✅ Performance maintained or improved
✅ Email alerts delivered
✅ Real-time updates working
✅ ML confidence displayed
✅ Anomaly detection active
✅ Swagger docs accessible
✅ Docker deployment successful

---

**Deployment Status:** [ ] Not Started | [ ] In Progress | [ ] Complete

**Deployed By:** _______________
**Date:** _______________
**Sign-off:** _______________

---

## QUICK REFERENCE

### Start All Services
```bash
# Terminal 1: Backend
node server_enhanced.js

# Terminal 2: ML Service
python ml_service/app_enhanced.py

# Terminal 3: Anomaly Service
python ml_service/anomaly_service.py
```

### Or with Docker
```bash
docker-compose up -d
```

### Check Status
```bash
# Backend
curl http://localhost:3000/api/sensor/test

# ML Service
curl http://localhost:5001/predict -X POST -H "Content-Type: application/json" -d '{"voltage":230,"current":5,"temperature":60,"humidity":50,"smoke":400}'

# Anomaly Service
curl http://localhost:5002/detect -X POST -H "Content-Type: application/json" -d '{"voltage":230,"current":5,"temperature":60,"humidity":50,"smoke":400}'

# Swagger
curl http://localhost:3000/api/docs
```

---

**Ready to deploy! 🚀**

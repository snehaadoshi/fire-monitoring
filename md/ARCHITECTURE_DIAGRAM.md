# 🏗️ ENHANCED ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (advance.html)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Dashboard  │  │    Charts    │  │    Alerts    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
│                            │                                         │
│              ┌─────────────┴─────────────┐                          │
│              │                           │                          │
│         [Polling]                  [WebSocket] ← NEW FEATURE        │
│         (Fallback)                 (Real-time)                      │
└─────────────┬───────────────────────────┬─────────────────────────┘
              │                           │
              ▼                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    server_enhanced.js                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │   HTTP API   │  │  Socket.IO   │  │   Swagger    │     │    │
│  │  │   (Existing) │  │     NEW      │  │     NEW      │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                  routes/sensor_enhanced.js                  │    │
│  │                                                             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │  Sensor  │  │   ML     │  │ Anomaly  │  │  Email   │  │    │
│  │  │  Logic   │  │  Call    │  │   Call   │  │  Alert   │  │    │
│  │  │(Existing)│  │   NEW    │  │   NEW    │  │   NEW    │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              websocket/socketHandler.js (NEW)               │    │
│  │  • emitSensorUpdate()                                       │    │
│  │  • emitAlertCreated()                                       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │               email/emailService.js (NEW)                   │    │
│  │  • sendAlertEmail() → Admin users                           │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────┬───────────────────┬───────────────────┬─────────────┘
               │                   │                   │
               ▼                   ▼                   ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL (Neon)  │  │  ML Service      │  │ Anomaly Service  │
│                      │  │  (Flask:5001)    │  │ (Flask:5002)     │
│  ┌────────────────┐  │  │                  │  │                  │
│  │  sensor_data   │  │  │ app_enhanced.py  │  │ anomaly_service  │
│  │  + ml_confidence│ │  │                  │  │      .py         │
│  │  + anomaly_score│ │  │  ┌────────────┐  │  │                  │
│  │  + is_anomaly   │ │  │  │ Random     │  │  │  ┌────────────┐  │
│  │     (NEW)       │ │  │  │ Forest     │  │  │  │ Isolation  │  │
│  └────────────────┘  │  │  │ Classifier │  │  │  │  Forest    │  │
│                      │  │  └────────────┘  │  │  └────────────┘  │
│  ┌────────────────┐  │  │                  │  │                  │
│  │     alerts     │  │  │  Returns:        │  │  Returns:        │
│  │  + ANOMALY_    │  │  │  {               │  │  {               │
│  │    DETECTED    │  │  │   fire_risk,     │  │   is_anomaly,    │
│  │     (NEW)      │  │  │   confidence     │  │   anomaly_score  │
│  └────────────────┘  │  │  }               │  │  }               │
│                      │  │     NEW          │  │     NEW          │
│  ┌────────────────┐  │  └──────────────────┘  └──────────────────┘
│  │     users      │  │
│  │     logs       │  │
│  │ module_status  │  │
│  │   (Existing)   │  │
│  └────────────────┘  │
└──────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DOCKER DEPLOYMENT (NEW)                         │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │   backend      │  │  ml_service    │  │  anomaly       │       │
│  │   container    │  │   container    │  │  container     │       │
│  │   (Node.js)    │  │   (Python)     │  │  (Python)      │       │
│  │   Port: 3000   │  │   Port: 5001   │  │  Port: 5002    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                      │
│                    docker-compose.yml                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      EMAIL NOTIFICATIONS (NEW)                       │
│                                                                      │
│  Alert Created → Email Service → SMTP → Admin Inboxes               │
│                                                                      │
│  Triggers: HIGH or CRITICAL alerts                                   │
│  Recipients: All users with role='Admin'                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      API DOCUMENTATION (NEW)                         │
│                                                                      │
│  https://fire-monitoring.onrender.com/api/docs                                      │
│                                                                      │
│  Interactive Swagger UI for all endpoints                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW - SENSOR INGESTION (ENHANCED)

```
ESP32/Sensor
    │
    │ POST /api/sensor
    │ {voltage, current, temp, humidity, smoke}
    ▼
┌─────────────────────────────────────┐
│  routes/sensor_enhanced.js          │
│                                     │
│  1. Validate data                   │
│  2. Call ML service (confidence) ←──┼─→ ML Service (5001)
│  3. Call anomaly service         ←──┼─→ Anomaly Service (5002)
│  4. Insert to database              │
│  5. Update module status            │
│  6. Check thresholds                │
│  7. Create alerts if needed         │
│  8. Emit WebSocket update        ───┼─→ Connected clients
│  9. Send email if HIGH/CRITICAL  ───┼─→ Admin emails
│                                     │
└─────────────────────────────────────┘
    │
    ▼
Database Updated
    │
    ▼
Frontend Auto-Updates (WebSocket or Polling)
```

---

## FEATURE ACTIVATION MATRIX

```
┌──────────────────┬─────────────┬──────────────┬─────────────┐
│ Feature          │ Requirement │ Fallback     │ Impact      │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ WebSocket        │ server_     │ Polling      │ Real-time   │
│                  │ enhanced.js │ continues    │ updates     │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ Email Alerts     │ EMAIL_*     │ Silently     │ Instant     │
│                  │ env vars    │ disabled     │ notify      │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ ML Confidence    │ app_        │ Returns null │ Prediction  │
│                  │ enhanced.py │              │ certainty   │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ Anomaly          │ anomaly_    │ Returns 0    │ Pattern     │
│ Detection        │ service.py  │              │ detection   │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ Swagger Docs     │ server_     │ Not          │ API         │
│                  │ enhanced.js │ available    │ testing     │
├──────────────────┼─────────────┼──────────────┼─────────────┤
│ Docker           │ docker-     │ Manual       │ Easy        │
│                  │ compose.yml │ start        │ deploy      │
└──────────────────┴─────────────┴──────────────┴─────────────┘
```

---

## FILE ORGANIZATION

```
major/
├── server.js                    (Original - Unchanged)
├── server_enhanced.js           (NEW - Enhanced version)
├── package.json                 (Original - Unchanged)
├── package_enhanced.json        (NEW - New dependencies)
├── .env.example                 (NEW - Config template)
├── Dockerfile                   (NEW - Backend container)
├── docker-compose.yml           (NEW - Orchestration)
├── migration_enhanced.sql       (NEW - DB migration)
│
├── routes/
│   ├── users.js                 (Original - Unchanged)
│   ├── logs.js                  (Original - Unchanged)
│   ├── alerts.js                (Original - Unchanged)
│   ├── sensor.js                (Original - Unchanged)
│   └── sensor_enhanced.js       (NEW - Enhanced version)
│
├── websocket/                   (NEW DIRECTORY)
│   └── socketHandler.js         (NEW - WebSocket logic)
│
├── email/                       (NEW DIRECTORY)
│   └── emailService.js          (NEW - Email alerts)
│
├── anomaly/                     (NEW DIRECTORY)
│   └── anomalyService.js        (NEW - Anomaly integration)
│
├── swagger/                     (NEW DIRECTORY)
│   ├── swaggerConfig.js         (NEW - Swagger setup)
│   └── apiDocs.js               (NEW - API schemas)
│
├── public/                      (NEW DIRECTORY)
│   └── websocket-client.js      (NEW - Frontend WebSocket)
│
├── ml_service/
│   ├── app.py                   (Original - Unchanged)
│   ├── app_enhanced.py          (NEW - With confidence)
│   ├── anomaly_service.py       (NEW - Anomaly detection)
│   ├── requirements.txt         (Original - Unchanged)
│   ├── requirements_enhanced.txt(NEW - New dependencies)
│   └── Dockerfile               (NEW - ML container)
│
└── docs/                        (NEW DIRECTORY)
    ├── ENHANCED_FEATURES.md     (NEW - Feature docs)
    ├── INTEGRATION_GUIDE.md     (NEW - Integration steps)
    ├── QUICKSTART_ENHANCED.md   (NEW - Quick start)
    ├── HTML_INTEGRATION_SNIPPETS.html (NEW - Code snippets)
    └── IMPLEMENTATION_SUMMARY.md(NEW - This file)
```

---

**All features implemented with ZERO modifications to existing files!** ✅

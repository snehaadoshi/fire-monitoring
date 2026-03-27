# 🚀 Device Commands Quick Reference

## Setup (One-Time)

```bash
# 1. Run migration
psql "YOUR_NEON_CONNECTION_STRING" -f device_commands_migration.sql

# 2. Restart server
npm start
```

## API Endpoints

### 📤 Send Command (Web → Server)
```http
POST /api/commands
Content-Type: application/json

{
  "module_no": 1,
  "command": "START"  // or "STOP"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "module_no": 1,
    "command": "START",
    "status": "PENDING",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 📥 Get Latest Command (ESP32 → Server)
```http
GET /api/commands/device-command/latest?module_no=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "module_no": 1,
    "command": "START",
    "status": "PENDING",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Testing

### cURL Commands
```bash
# Send START
curl -X POST https://fire-monitoring.onrender.com/api/commands \
  -H "Content-Type: application/json" \
  -d '{"module_no": 1, "command": "START"}'

# Send STOP
curl -X POST https://fire-monitoring.onrender.com/api/commands \
  -H "Content-Type: application/json" \
  -d '{"module_no": 1, "command": "STOP"}'

# Get latest
curl https://fire-monitoring.onrender.com/api/commands/device-command/latest?module_no=1
```

### Node.js Test
```bash
node test_device_commands.js
```

## ESP32 Integration

```cpp
#include <HTTPClient.h>
#include <ArduinoJson.h>

void checkForCommands() {
  HTTPClient http;
  http.begin("http://your-server.com/api/commands/device-command/latest?module_no=1");
  
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String payload = http.getString();
    
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload);
    
    String command = doc["data"]["command"];
    
    if (command == "START") {
      // Start your device
      Serial.println("Starting device...");
    } else if (command == "STOP") {
      // Stop your device
      Serial.println("Stopping device...");
    }
  }
  
  http.end();
}

void loop() {
  checkForCommands();
  delay(5000); // Check every 5 seconds
}
```

## Console Output

When working correctly, you'll see:
```
[COMMAND INSERTED] Module 1: START - ID: 1
[DEVICE COMMAND FETCH] Module 1: START
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Error | Ensure server is running and route is loaded |
| Database Error | Run migration script first |
| Invalid Command | Only START and STOP are allowed |
| No Data | Check if commands exist in database |

## Database Query

Check commands directly:
```sql
SELECT * FROM device_commands ORDER BY created_at DESC LIMIT 10;
```

## Files Modified

- ✅ `routes/commands.js` - Added POST / route
- ✅ `advance.html` - Fixed endpoint URL
- ✅ `device_commands_migration.sql` - New table
- ✅ No existing code deleted

---

**Status:** ✅ Ready for Production

# IoT Device Command Setup Guide

## Quick Setup

### 1. Run Database Migration

Execute the migration to create the `device_commands` table:

```bash
psql -U postgres -d fire_major -f device_commands_migration.sql
```

Or if using Neon PostgreSQL connection string:

```bash
psql "YOUR_NEON_CONNECTION_STRING" -f device_commands_migration.sql
```

### 2. Restart Server

```bash
npm start
```

## API Endpoints

### Send Command to Device

**Endpoint:** `POST /api/commands/device-command`

**Request Body:**
```json
{
  "module_no": 1,
  "command": "START"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Command inserted successfully",
  "data": {
    "id": 1,
    "module_no": 1,
    "command": "START",
    "status": "PENDING",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Get Latest Command (for ESP32)

**Endpoint:** `GET /api/commands/device-command/latest?module_no=1`

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

## ESP32 Integration Example

```cpp
// ESP32 polls this endpoint every 5 seconds
String url = "http://your-server.com/api/commands/device-command/latest?module_no=1";

HTTPClient http;
http.begin(url);
int httpCode = http.GET();

if (httpCode == 200) {
  String payload = http.getString();
  // Parse JSON and execute command
  if (payload.indexOf("\"command\":\"START\"") > 0) {
    // Start device
  } else if (payload.indexOf("\"command\":\"STOP\"") > 0) {
    // Stop device
  }
}
```

## Testing with cURL

### Send START command:
```bash
curl -X POST https://fire-monitoring.onrender.com/api/commands/device-command \
  -H "Content-Type: application/json" \
  -d '{"module_no": 1, "command": "START"}'
```

### Send STOP command:
```bash
curl -X POST https://fire-monitoring.onrender.com/api/commands/device-command \
  -H "Content-Type: application/json" \
  -d '{"module_no": 1, "command": "STOP"}'
```

### Get latest command:
```bash
curl https://fire-monitoring.onrender.com/api/commands/device-command/latest?module_no=1
```

## Notes

- Commands are stored with `PENDING` status by default
- ESP32 should poll the `/latest` endpoint periodically
- All existing functionality remains unchanged
- Console logs show when commands are inserted/fetched

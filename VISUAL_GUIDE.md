# 🎨 VISUAL FEATURE GUIDE

## New Features - Visual Overview

### 1. System Health Monitor (Left Panel)
```
┌─────────────────────────────────┐
│   SYSTEM HEALTH                 │
├─────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐   │
│  │    25    │  │    3     │   │
│  │ Active   │  │ Alerts   │   │
│  │ Modules  │  │ Today    │   │
│  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐   │
│  │  45.2°C  │  │   280    │   │
│  │ Highest  │  │ Highest  │   │
│  │   Temp   │  │  Smoke   │   │
│  └──────────┘  └──────────┘   │
└─────────────────────────────────┘
```
**Location**: Left sidebar, below site info
**Updates**: Every 10 seconds
**Color-coded**: Green, Red, Orange, Purple

---

### 2. Alert Button (Top Right)
```
┌─────────────────────────────────────────┐
│  Control Panel                          │
│                    [🚨 Alerts] [📞] [Logout] │
└─────────────────────────────────────────┘
```
**Action**: Click to view alert history
**Badge**: Shows count when alerts active
**Link**: Opens alerts.html

---

### 3. Module Block with Indicators
```
┌─────────────┐
│ 🟢 ⚠️      │  ← Status dot + Alert badge
│             │
│     85      │  ← Fire risk value
│             │
└─────────────┘
   Module 1      ← Module label
```
**Status Dots**:
- 🟢 Green = Online
- 🔴 Red = Offline (>30s)

**Alert Badge**:
- ⚠️ Appears when alert triggered
- Red pulsing animation

**Interactions**:
- Single click = Show parameters
- Double click = Show graph

---

### 4. Alert History Page
```
┌──────────────────────────────────────────────┐
│  🚨 Alert History        [← Back to Dashboard] │
├──────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐                 │
│  │    15    │  │    8     │                 │
│  │ Alerts   │  │ Active   │                 │
│  │ Today    │  │ Alerts   │                 │
│  └──────────┘  └──────────┘                 │
├──────────────────────────────────────────────┤
│  Filters:                                    │
│  [Module #] [Start Date] [End Date] [Status] │
│  [🔍 Filter] [Clear Filters]                │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │ Module 5 - HIGH TEMPERATURE      [HIGH]│ │
│  │ Message: Temperature alert: 65°C       │ │
│  │ Time: 2024-01-15 14:30:25             │ │
│  │                      [Clear Alert]     │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ Module 12 - HIGH SMOKE        [CRITICAL]│ │
│  │ Message: Smoke alert: 450 ppm          │ │
│  │ Time: 2024-01-15 14:25:10             │ │
│  │                      [Clear Alert]     │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```
**Features**:
- Real-time statistics
- Filter by module, date, status
- Clear individual alerts
- Color-coded severity

---

### 5. Graph Modal (Historical Data)
```
┌────────────────────────────────────────────────┐
│  📊 Module 5 - Historical Data            [×]  │
├────────────────────────────────────────────────┤
│                                                │
│   Temperature (°C)                             │
│   80 ┤                                         │
│   60 ┤     ╱╲                                  │
│   40 ┤   ╱    ╲    ╱╲                         │
│   20 ┤ ╱        ╲╱    ╲                       │
│    0 └─────────────────────────────────────   │
│                                                │
│   Smoke (ppm)                                  │
│  500 ┤                                         │
│  400 ┤           ╱╲                            │
│  300 ┤         ╱    ╲                          │
│  200 ┤       ╱        ╲                        │
│  100 ┤     ╱            ╲                      │
│    0 └─────────────────────────────────────   │
│                                                │
│   Voltage (V)                                  │
│    6 ┤ ─────────────────────────────          │
│    5 ┤                                         │
│    4 ┤                                         │
│    3 ┤                                         │
│    0 └─────────────────────────────────────   │
│                                                │
└────────────────────────────────────────────────┘
```
**Access**:
- Double-click module block
- Click "📊 View Graph" button

**Features**:
- Last 50 readings
- Multi-parameter display
- Interactive Chart.js
- Zoom and pan

---

### 6. Parameter Panel with Graph Button
```
┌─────────────────────────────────┐
│  Parameters                     │
├─────────────────────────────────┤
│  SRNO: 5                        │
│  Value: 85                      │
├─────────────────────────────────┤
│  [📊 View Graph]                │
├─────────────────────────────────┤
│  Voltage (V)         5.2        │
│  Current (A)         2.5        │
│  Power Output (W)    13.0       │
│  Temperature (°C)    65.0       │
│  Humidity (%)        45.0       │
│  🔥 Fire Risk Index  85         │
│  Gas (ppm)           120        │
│  Smoke (ppm)         350        │
│  Identify Fire       🔥 HIGH    │
│  Module Efficiency   86.7%      │
│  Degradation         13.3%      │
│  Ground Fault        NO         │
└─────────────────────────────────┘
```
**New**: "View Graph" button at top
**Action**: Opens graph modal for this module

---

### 7. Dashboard Layout (Complete View)
```
┌────────────────────────────────────────────────────────────────┐
│  🔥 Early Fire Monitoring Dashboard                            │
│                                    [🚨 Alerts] [📞] [Logout]   │
├──────────────┬─────────────────────────────────────────────────┤
│              │  Control Panel                                  │
│ SYSTEM       │  [📅 Date] [⚡ Control] [🔍 Parameter]         │
│ HEALTH       │  [📊 Visualization] [❓ Help]                  │
│              ├─────────────────────────────────────────────────┤
│ [25 Active]  │  Blocks                                         │
│ [3 Alerts]   │  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐   │
│ [45.2°C]     │  │🟢85│🟢42│🟢38│🟢55│⚠️92│🟢40│🟢35│🟢48│🟢39│🟢44│   │
│ [280 ppm]    │  ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤   │
│              │  │🟢36│🟢41│⚠️88│🟢37│🟢43│🟢39│🟢42│🟢38│🟢40│🟢45│   │
├──────────────┤  ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤   │
│              │  │🟢47│🟢39│🟢41│🟢38│🟢44│🟢42│🟢40│🟢43│🟢39│🟢41│   │
│ SITE INFO    │  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘   │
│              │                                                 │
│ User: Admin  │  [⬅ Prev] Page 1 [Next ➡]                    │
│ Email: ...   │                                                 │
│ Role: Admin  ├─────────────────────────────────────────────────┤
│ Site: Main   │                                                 │
│ Modules: 35  │                                                 │
├──────────────┤                                                 │
│              │                                                 │
│ PARAMETERS   │                                                 │
│              │                                                 │
│ [Details]    │                                                 │
│              │                                                 │
└──────────────┴─────────────────────────────────────────────────┘
```

---

### 8. Alert Indicators (Visual States)

#### Normal State
```
┌─────┐
│ 🟢  │  ← Green dot (online)
│  35 │  ← Normal value
└─────┘
```

#### Warning State
```
┌─────┐
│ 🟢  │  ← Still online
│  65 │  ← Warning value (orange)
└─────┘
```

#### Alert State
```
┌─────┐
│🟢⚠️ │  ← Online + Alert badge
│  85 │  ← Critical value (red, pulsing)
└─────┘
```

#### Offline State
```
┌─────┐
│ 🔴  │  ← Red dot (offline)
│  -- │  ← No data
└─────┘
```

---

### 9. Color Coding Reference

#### Fire Risk Values
- **0-30**: 🟢 Green (Safe)
- **31-60**: 🔵 Blue (Watch)
- **61-80**: 🟠 Orange (Warning)
- **81-100**: 🔴 Red (Critical)

#### Alert Severity
- **LOW**: 🟡 Yellow
- **MEDIUM**: 🟠 Orange
- **HIGH**: 🔴 Red
- **CRITICAL**: 🔴 Red (pulsing)

#### System Health Cards
- **Active Modules**: 🟢 Green gradient
- **Alerts Today**: 🔴 Red gradient
- **Highest Temp**: 🟠 Orange gradient
- **Highest Smoke**: 🟣 Purple gradient

---

### 10. User Interactions

#### Module Block Interactions
```
Single Click → Show Parameters
Double Click → Show Graph
Hover → Highlight
```

#### Alert Management
```
View Alerts → Click 🚨 button
Filter Alerts → Use filter controls
Clear Alert → Click "Clear Alert" button
```

#### Graph Viewing
```
Method 1: Double-click module
Method 2: Click module → "View Graph"
Close: Click × or outside modal
```

---

### 11. Responsive Behavior

#### Desktop (>900px)
```
┌─────────────┬──────────────────────┐
│   Sidebar   │   Main Dashboard     │
│   (380px)   │   (Flexible)         │
└─────────────┴──────────────────────┘
```

#### Mobile (<900px)
```
┌──────────────────────┐
│   Sidebar (Full)     │
├──────────────────────┤
│   Dashboard (Full)   │
└──────────────────────┘
```

---

### 12. Animation Effects

#### Alert Pulse
```
Frame 1: ●  (normal)
Frame 2: ◉  (glow)
Frame 3: ⦿  (max glow)
Frame 2: ◉  (glow)
Frame 1: ●  (normal)
```
**Duration**: 1.5 seconds
**Loop**: Infinite

#### Status Dot
```
🟢 Solid (online)
🔴 Solid (offline)
```
**No animation** - Static indicator

---

### 13. Modal Overlays

#### Graph Modal
```
Background: rgba(0,0,0,0.7) with blur
Modal: White, centered, 90% width
Close: × button or click outside
```

#### Emergency Contacts
```
Background: rgba(0,0,0,0.5) with blur
Modal: White, centered, max 500px
Close: × button or click outside
```

---

### 14. Data Flow Visualization

```
ESP32/Sensor
     ↓
POST /api/sensor
     ↓
Check Thresholds
     ↓
Create Alert (if needed)
     ↓
Update Module Status
     ↓
Store in Database
     ↓
Frontend Polls (3s)
     ↓
Update Dashboard
     ↓
Show Visual Indicators
```

---

### 15. Alert Lifecycle

```
1. Sensor Data Received
   ↓
2. Threshold Check
   ↓
3. Alert Created (if exceeded)
   ↓
4. Visual Indicator Added
   ↓
5. Alert Logged to Database
   ↓
6. User Views Alert History
   ↓
7. User Clears Alert
   ↓
8. Alert Marked as Cleared
   ↓
9. Visual Indicator Removed
```

---

## Quick Reference Icons

### Status Icons
- 🟢 Online/Safe
- 🔴 Offline/Critical
- 🟠 Warning
- 🔵 Watch
- ⚠️ Alert
- 📊 Graph
- 🚨 Alerts
- 📞 Emergency
- 🔥 Fire Risk

### Action Icons
- ← Back
- × Close
- 🔍 Search/Filter
- ⬅ Previous
- ➡ Next
- ✅ Success
- ❌ Error

---

**Visual Guide Version**: 1.0
**Last Updated**: 2024
**For**: Fire Monitoring System v2.0

🎨 **All visual elements are production-ready!**

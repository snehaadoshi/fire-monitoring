# Fire Monitoring System

A comprehensive fire monitoring dashboard with user management and logging capabilities.

## Features

- **User Management**: Add users with role-based access
- **Authentication**: Secure login/logout with password hashing
- **Real-time Monitoring**: Fire risk monitoring dashboard
- **Comprehensive Logging**: All actions logged to database
- **CSV Export**: Download logs and parameters as CSV
- **Responsive UI**: Modern, clean interface

## Setup Instructions

### 1. Database Setup

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE fire_major;
   ```
3. Run the schema:
   ```bash
   psql -U postgres -d fire_major -f schema.sql
   ```

### 2. Environment Configuration

1. Copy `.env` file and update with your database credentials:
   ```
   DB_NAME=fire_major
   DB_USER=postgres
   DB_PASSWORD=YOUR_PASSWORD_HERE
   DB_HOST=localhost
   DB_PORT=5432
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Usage

1. **Access**: Open https://fire-monitoring.onrender.com
2. **Add Users**: Click "Add User" to register new users
3. **Login**: Use email/password (no site name required)
4. **Monitor**: View fire risk dashboard
5. **Download Logs**: Use "Download System Logs" button

## API Endpoints

- `POST /api/users/add` - Add new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/logs` - Get logs (with filtering)
- `GET /api/logs/download` - Download logs as CSV

## Database Tables

### users
- id, full_name, email, password, role, site_name, created_at

### logs
- id, user_id, action_type, action_description, ip_address, created_at

## Logged Actions

- LOGIN, LOGOUT, ADD_USER, DOWNLOAD, SEARCH

All actions are automatically logged with user context and IP address.
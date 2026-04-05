# CashSupportShipment - Complete Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment](#production-deployment)
5. [Database Management](#database-management)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
8. [Admin Dashboard Access](#admin-dashboard-access)
9. [Troubleshooting](#troubleshooting)
10. [Support](#support)

---

## Project Overview

CashSupportShipment is a full-stack logistics and shipment tracking platform built with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (easily upgradeable to PostgreSQL/MySQL)

### Features Included:
- ✅ Modern, responsive landing page
- ✅ Real-time shipment tracking
- ✅ User authentication (Login/Register)
- ✅ Admin dashboard with:
  - User management
  - Shipment management
  - Content editing
  - Analytics & reporting
  - Platform settings
- ✅ Contact form
- ✅ FAQ section
- ✅ Testimonials
- ✅ Full API backend

---

## System Requirements

### Minimum Requirements:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: 2GB minimum
- **Storage**: 1GB free space
- **OS**: Linux, macOS, or Windows

### Recommended:
- **Node.js**: v20.0.0 or higher
- **RAM**: 4GB
- **Storage**: 5GB free space

---

## Local Development Setup

### Step 1: Clone/Extract the Project

```bash
# If you received a zip file, extract it
cd cashsupportshipment
```

### Step 2: Install Frontend Dependencies

```bash
cd app
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

```bash
# In the backend directory
cp .env.example .env

# Edit .env file with your settings
nano .env
```

### Step 5: Start the Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd app
npm run dev
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5173/admin

---

## Production Deployment

### Option 1: Deploy to VPS/Cloud Server (Recommended)

#### Step 1: Prepare Your Server

```bash
# Update system (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 2: Upload Project Files

```bash
# Create application directory
sudo mkdir -p /var/www/cashsupportshipment
sudo chown -R $USER:$USER /var/www/cashsupportshipment

# Upload your files (using SCP, SFTP, or Git)
scp -r /local/path/to/cashsupportshipment/* user@server:/var/www/cashsupportshipment/
```

#### Step 3: Install Dependencies

```bash
cd /var/www/cashsupportshipment

# Install frontend dependencies
cd app
npm install
npm run build

# Install backend dependencies
cd ../backend
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values
```

#### Step 4: Start Backend with PM2

```bash
cd /var/www/cashsupportshipment/backend
pm2 start server.js --name "css-api"
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/cashsupportshipment
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/cashsupportshipment/app/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cashsupportshipment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### Option 2: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create cashsupportshipment

# Add buildpacks
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

### Option 3: Deploy to Railway/Render

1. Create account on Railway or Render
2. Connect your GitHub repository
3. Set environment variables in dashboard
4. Deploy automatically

---

## Database Management

### SQLite (Default)

The application uses SQLite by default. The database file is located at:
```
/backend/database.sqlite
```

### Backup Database

```bash
# Backup
cp /var/www/cashsupportshipment/backend/database.sqlite /backups/css-backup-$(date +%Y%m%d).sqlite

# Or use cron for automatic daily backups
0 2 * * * cp /var/www/cashsupportshipment/backend/database.sqlite /backups/css-backup-$(date +\%Y\%m\%d).sqlite
```

### Migrate to PostgreSQL/MySQL

1. Install database driver:
```bash
cd backend
npm install pg  # for PostgreSQL
# OR
npm install mysql2  # for MySQL
```

2. Update database connection in `server.js`

3. Run migration script (create one based on your schema)

---

## Environment Variables

### Required Variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `JWT_SECRET` | Secret for JWT tokens | Required |
| `NODE_ENV` | Environment mode | development |

### Optional Variables:

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | Email server host |
| `SMTP_PORT` | Email server port |
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password |
| `FRONTEND_URL` | Frontend URL for CORS |

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | User/Admin |
| PUT | `/api/users/:id` | Update user | User/Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |

### Shipment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/shipments` | Create shipment | Yes |
| GET | `/api/shipments` | List shipments | Yes |
| GET | `/api/shipments/track/:trackingNumber` | Track shipment | Public |
| GET | `/api/shipments/:id` | Get shipment | Yes |
| PUT | `/api/shipments/:id/status` | Update status | Yes |
| DELETE | `/api/shipments/:id` | Delete shipment | Admin |

### Contact Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit contact form | Public |
| GET | `/api/contact` | List messages | Admin |
| PUT | `/api/contact/:id/status` | Update message status | Admin |

### Stats Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stats` | Dashboard statistics | Admin |

---

## Admin Dashboard Access

### Default Admin Credentials:

- **Email**: `admin@cashsupportshipment.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change the default admin password immediately after first login!

### Creating a New Admin:

1. Register a new user
2. Access database directly:
```bash
sqlite3 backend/database.sqlite
UPDATE users SET role = 'admin' WHERE email = 'newadmin@example.com';
```

---

## Troubleshooting

### Common Issues:

#### 1. Port Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

#### 2. Permission Denied
```bash
# Fix permissions
sudo chown -R $USER:$USER /var/www/cashsupportshipment
chmod -R 755 /var/www/cashsupportshipment
```

#### 3. Nginx 502 Error
```bash
# Check PM2 status
pm2 status
pm2 logs css-api

# Restart backend
pm2 restart css-api
```

#### 4. Database Locked
```bash
# Backup and recreate database
cp backend/database.sqlite backend/database.sqlite.backup
rm backend/database.sqlite
npm run setup  # If you have a setup script
```

### Logs:

```bash
# Backend logs
pm2 logs css-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## Updating the Application

```bash
cd /var/www/cashsupportshipment

# Pull latest changes
git pull origin main

# Update frontend
cd app
npm install
npm run build

# Update backend
cd ../backend
npm install

# Restart PM2
pm2 restart css-api

# Reload Nginx
sudo systemctl reload nginx
```

---

## Security Recommendations

1. **Change default passwords immediately**
2. **Use strong JWT_SECRET** (generate with: `openssl rand -base64 32`)
3. **Enable firewall** (UFW recommended)
4. **Keep software updated**
5. **Use HTTPS only**
6. **Regular backups**
7. **Monitor logs**

---

## Support

For support and questions:
- Email: support@cashsupportshipment.com
- Documentation: https://docs.cashsupportshipment.com
- GitHub Issues: https://github.com/yourusername/cashsupportshipment/issues

---

## License

This project is licensed under the MIT License.

---

**Built with ❤️ by CashSupportShipment Team**

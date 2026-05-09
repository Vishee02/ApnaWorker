# ⚡ ApnaWorker — Hyperlocal Freelance Marketplace

> A modern, production-grade platform to hire verified local professionals — electricians, plumbers, developers, designers and more. Inspired by Urban Company & Fiverr.

![ApnaWorker](https://img.shields.io/badge/ApnaWorker-v1.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## 🚀 Live Demo

| Page       | URL                            |
|------------|-------------------------------|
| Home       | `/index.html`                  |
| Find Workers | `/freelancer.html`           |
| Book       | `/booking.html`                |
| Dashboard  | `/dashboard.html`              |
| Chat       | `/chat.html`                   |
| **Admin**  | `/admin.html`                  |
| Login      | `/login.html`                  |
| Register   | `/register.html`               |

### 🔐 Admin Credentials
```
Email:    admin@apnaworker.com
Password: admin123
```

---

## 📁 Project Structure

```
ApnaWorker/
├── index.html          ← Home page
├── login.html          ← Login
├── register.html       ← Register (client/worker)
├── freelancer.html     ← Browse workers
├── booking.html        ← Book a service
├── dashboard.html      ← User dashboard
├── chat.html           ← Messaging
├── admin.html          ← Full admin panel ← NEW
│
├── css/
│   ├── style.css       ← Global styles + glassmorphism
│   ├── navbar.css      ← Sticky animated navbar
│   ├── profile.css     ← Worker profiles
│   ├── chat.css        ← Chat UI
│   ├── admin.css       ← Admin panel styles ← NEW
│   └── responsive.css  ← Mobile-first responsive
│
├── js/
│   ├── app.js          ← Three.js, cards, data
│   ├── search.js       ← Search + suggestions + toast
│   ├── auth.js         ← Login/Register logic
│   ├── booking.js      ← Multi-step booking
│   ├── chat.js         ← Real-time chat UI
│   ├── darkmode.js     ← Dark/light toggle
│   └── admin.js        ← Complete admin logic ← NEW
│
├── backend/
│   ├── server.js       ← Node.js + Express + Socket.io
│   ├── package.json    ← Backend dependencies
│   └── .env.example    ← Environment template
│
├── package.json        ← Root scripts
├── Procfile            ← Railway/Heroku deploy
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend
| Technology    | Purpose                        |
|--------------|-------------------------------|
| HTML5         | Semantic markup                |
| CSS3          | Glassmorphism, animations      |
| JavaScript    | Vanilla ES6+, no framework     |
| Three.js      | 3D particle background         |
| Font Awesome  | Icons                          |
| Google Fonts  | Poppins typography             |

### Backend
| Technology    | Purpose                        |
|--------------|-------------------------------|
| Node.js 18+   | Runtime                        |
| Express.js    | REST API server                |
| MongoDB Atlas | Primary database               |
| Mongoose      | ODM / Schema validation        |
| Socket.io     | Real-time chat & notifications |
| JWT           | Authentication tokens          |
| bcryptjs      | Password hashing               |
| Cloudinary    | Image upload & CDN             |
| Razorpay      | Payment gateway                |
| Multer        | File upload middleware         |
| Helmet        | Security headers               |
| express-rate-limit | Rate limiting            |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- Git

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourusername/apnaworker.git
cd apnaworker

# Install backend dependencies
cd backend
npm install
```

### Step 2 — Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env   # or use VS Code / any editor
```

**Minimum required variables for local dev:**
```env
MONGODB_URI=mongodb://localhost:27017/apnaworker
JWT_SECRET=any_long_random_string_here
PORT=5000
```

### Step 3 — Start the Server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### Step 4 — Open the App

```
Frontend: http://localhost:5000
API:      http://localhost:5000/api/health
Admin:    http://localhost:5000/admin.html
```

The database will be **auto-seeded** on first run with:
- Admin user: `admin@apnaworker.com` / `admin123`
- Default categories (Electrician, Plumber, etc.)
- Default cities
- Welcome coupon: `WELCOME20` (20% off)

---

## ☁️ Deployment Guide

### Option A: Deploy to Render (FREE — Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/apnaworker.git
git push -u origin main
```

2. **Create MongoDB Atlas database**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster → Get connection string
   - Whitelist IP: `0.0.0.0/0` (allow all)

3. **Deploy on Render**
   - Go to [render.com](https://render.com) → New Web Service
   - Connect your GitHub repo
   - Set settings:
     ```
     Root Directory:   (leave blank)
     Build Command:    cd backend && npm install
     Start Command:    cd backend && node server.js
     ```
   - Add environment variables (from your `.env`)

4. **Done!** Your app is live at `https://apnaworker.onrender.com`

---

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MongoDB plugin OR use Atlas URI
4. Set environment variables in Railway dashboard
5. Railway auto-detects `Procfile` → deploys automatically

---

### Option C: Deploy to VPS (DigitalOcean/AWS/Hetzner)

```bash
# On your server
git clone https://github.com/yourusername/apnaworker.git
cd apnaworker/backend

# Install dependencies
npm install

# Install PM2 globally
npm install -g pm2

# Create .env file
nano .env
# (paste your production environment variables)

# Start with PM2
pm2 start server.js --name apnaworker
pm2 save
pm2 startup

# Install Nginx
sudo apt install nginx

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/apnaworker
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/apnaworker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Add SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔑 Environment Variables Reference

| Variable                  | Required | Description                        |
|--------------------------|----------|------------------------------------|
| `MONGODB_URI`             | ✅ Yes   | MongoDB connection string           |
| `JWT_SECRET`              | ✅ Yes   | JWT signing secret (keep private)   |
| `PORT`                    | ❌ No    | Server port (default: 5000)         |
| `CLIENT_URL`              | ❌ No    | Frontend URL for CORS               |
| `CLOUDINARY_CLOUD_NAME`   | ⚡ Upload | Cloudinary account name             |
| `CLOUDINARY_API_KEY`      | ⚡ Upload | Cloudinary API key                  |
| `CLOUDINARY_API_SECRET`   | ⚡ Upload | Cloudinary API secret               |
| `RAZORPAY_KEY_ID`         | 💳 Pay   | Razorpay key ID (test/live)         |
| `RAZORPAY_KEY_SECRET`     | 💳 Pay   | Razorpay key secret                 |
| `SMTP_HOST`               | 📧 Email | SMTP server host                    |
| `SMTP_USER`               | 📧 Email | SMTP username                       |
| `SMTP_PASS`               | 📧 Email | SMTP password / app password        |

---

## 🎛️ Admin Panel Features

Access at `/admin.html` with `admin@apnaworker.com` / `admin123`

| Section         | Features                                                  |
|----------------|----------------------------------------------------------|
| **Overview**    | Revenue, bookings, users stats, charts, pending actions   |
| **Analytics**   | 7D/30D/90D revenue charts, platform metrics               |
| **Users**       | View, add, ban/unban, delete users                        |
| **Workers**     | Approve/reject, ban, add, delete workers                  |
| **Bookings**    | View all bookings, change status, CSV export              |
| **Categories**  | Add/edit/delete/toggle service categories dynamically     |
| **Services**    | Manage individual services under categories               |
| **Payments**    | Transaction history, revenue breakdown                    |
| **Payouts**     | Process/reject worker payout requests                     |
| **Coupons**     | Create, enable/disable, delete coupon codes               |
| **Reviews**     | Approve/reject/delete user reviews                        |
| **Notifications**| Send bulk notifications to all users/workers             |
| **Banners**     | Manage homepage banners & advertisements                   |
| **CMS/Blog**    | Manage blog posts and content pages                       |
| **Cities**      | Add/remove service cities                                 |
| **Settings**    | Platform, commission, SEO, email, security settings       |

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register       → Register new user
POST /api/auth/login          → Login, returns JWT
GET  /api/auth/me             → Get current user (auth required)
PUT  /api/auth/update-profile → Update profile
POST /api/auth/change-password→ Change password
```

### Workers
```
GET  /api/workers             → List workers (with filters)
GET  /api/workers/:id         → Single worker + reviews
PUT  /api/workers/:id         → Update profile
POST /api/workers/:id/upload-image → Upload avatar
```

### Bookings
```
POST  /api/bookings           → Create booking
GET   /api/bookings/my        → My bookings (client)
GET   /api/bookings/worker    → My bookings (worker)
PATCH /api/bookings/:id/status→ Update booking status
```

### Chat
```
GET  /api/chat/conversations  → All conversations
GET  /api/chat/:conversationId→ Messages in conversation
POST /api/chat/send           → Send text message
POST /api/chat/send-image     → Send image
```

### Payments
```
POST /api/payments/create-order → Create Razorpay order
POST /api/payments/verify       → Verify payment signature
```

### Other
```
GET  /api/categories          → All active categories
GET  /api/cities              → All active cities
GET  /api/search?q=plumber    → Search workers + categories
POST /api/coupons/validate    → Validate coupon code
GET  /api/notifications       → User notifications
GET  /api/health              → Health check
```

### Admin (requires admin JWT)
```
GET  /api/admin/stats         → Dashboard stats
GET  /api/admin/users         → All users
GET  /api/admin/workers       → All workers
GET  /api/admin/bookings      → All bookings
GET  /api/admin/payments      → All payments
POST /api/admin/notify-all    → Send bulk notification
... (full CRUD for all resources)
```

---

## 🎨 UI Features

- ✅ Dark / Light mode toggle (persisted)
- ✅ Three.js animated particle backgrounds
- ✅ Glassmorphism cards with blur effects
- ✅ 3D tilt hover effects on worker cards
- ✅ Typed text animation in hero
- ✅ Scroll reveal animations
- ✅ Sticky animated navbar
- ✅ Multi-step booking flow with validation
- ✅ Live chat UI with typing indicators
- ✅ Full admin panel with charts
- ✅ Toast notification system
- ✅ Search with auto-suggestions
- ✅ Mobile hamburger menu
- ✅ Fully responsive (mobile / tablet / desktop)

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"client"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apnaworker.com","password":"admin123"}'

# Get workers
curl http://localhost:5000/api/workers

# Search
curl "http://localhost:5000/api/search?q=electrician&city=Varanasi"
```

---

## 📦 Future Roadmap

- [ ] Next.js migration (App Router)
- [ ] Prisma + PostgreSQL option
- [ ] Google Maps integration
- [ ] Worker real-time tracking
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] OTP phone verification
- [ ] Worker KYC / Aadhaar upload
- [ ] Subscription plans
- [ ] Referral system
- [ ] SMS notifications
- [ ] PWA support
- [ ] Docker containerization
- [ ] CI/CD GitHub Actions
- [ ] Redis caching
- [ ] Swagger API docs

---

## 👨‍💻 Built With ❤️ in India

```
ApnaWorker © 2025 — Connecting verified local professionals
```

**Admin Login:** `admin@apnaworker.com` / `admin123`
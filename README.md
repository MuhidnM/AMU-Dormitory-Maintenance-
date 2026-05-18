# 🏫 AMU Dormitory Maintenance Request System

> A state-of-the-art, real-time full-stack enterprise platform built for Arba Minch University (AMU) to manage, track, and streamline dormitory maintenance requests.

---

## 🚀 Key Features

*   **👥 Role-Based Authentication & Dashboards (RBAC)**:
    *   **Student**: Submit maintenance requests, add description, upload circular-cropped image attachments (restricted to 1MB or less), and track real-time request status.
    *   **Staff (Technicians)**: Access assigned tickets, update work progress, and notify students instantly.
    *   **Admin (Maintenance Managers)**: Unified dashboard with real-time analytics, technician assignment queues, automated email triggers, and system audits.
*   **⚡ Real-Time Communications**:
    *   Powered by **Socket.IO** with a **Redis Cloud cache adapter** for scaling websocket channels and real-time alerts.
*   **📂 Full-Stack File Upload System**:
    *   Express/Multer backend limits attachments strictly to **1MB or less** for maximum bandwidth efficiency and security.
    *   Premium React frontend provides instant client-side size checks and visual warnings.
*   **🎨 Premium Branded Design System**:
    *   Responsive, beautiful, high-performance UI styled using **TailwindCSS**.
    *   Circular cropped AMU branding emblems seamlessly integrated on dark, light, and slate-gray views.
*   **💾 Database Persistence**:
    *   Engineered with **Supabase Cloud PostgreSQL** and orchestrated through **Prisma ORM**.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide React, React Hook Form, Zod.
*   **Backend**: Node.js, Express, Prisma ORM, Socket.IO, Redis Cloud, Multer, Nodemailer, Winston (Logging).
*   **Database & Cache**: Supabase PostgreSQL, Redis Labs.
*   **Hosting**: Render (Web Service for Backend, Static Site for Frontend).

---

## 🗺️ System Architecture

```mermaid
graph TD
    Client[React Frontend / SPA] <-->|HTTP / JSON / WSS| Server[Express API Server]
    Server <-->|Websockets Session Scaling| Redis[Redis Cloud Cache]
    Server <-->|Prisma ORM / DDL| DB[(Supabase PostgreSQL)]
    Server -->|SMTP Triggers| Mail[Nodemailer SMTP]
```

---

## 📂 Project Structure

```bash
├── backend
│   ├── prisma
│   │   ├── schema.prisma       # Prisma DB schemas
│   │   └── seed.js             # Supabase cloud seeding script
│   ├── src
│   │   ├── config              # Database & server configs
│   │   ├── controllers         # Express controllers (auth, requests, etc.)
│   │   ├── middlewares         # Auth, uploads, and error middlewares
│   │   ├── routes              # Express router endpoints
│   │   ├── services            # Socket.IO & SMTP Email triggers
│   │   ├── utils               # Logger, upload config, validation
│   │   └── server.js           # Server startup script
│   └── package.json
└── frontend
    ├── src
    │   ├── assets              # Branded graphics & logos
    │   ├── components          # Shared sidebar, navbars, cards
    │   ├── pages               # Landing, Login, Register, Dashboards
    │   ├── store               # Zustand state stores (authentication)
    │   └── App.jsx             # React core routing
    └── package.json
```

---

## ⚙️ Environment Configurations

Create a `.env` file in the root of both `backend` and `frontend` folders:

### Backend Configuration (`backend/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="your_jwt_secret_token"
REDIS_URL="redis://default:password@redis-xxxxx.crce302.ap-seast-1-3.ec2.cloud.redislabs.com:16414"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
```

### Frontend Configuration (`frontend/.env`):
```env
VITE_API_URL="https://amu-dorm-backend.onrender.com/api"
VITE_WS_URL="https://amu-dorm-backend.onrender.com"
```

---

## 💻 Local Installation

### 1. Clone & Set Up Database
```bash
# Clone the repository
git clone https://github.com/MuhidnM/AMU-Dormitory-Maintenance-.git
cd AMU-Dormitory-Maintenance-

# Install & Seed Backend
cd backend
npm install
npx prisma db push
node prisma/seed.js
```

### 2. Start Servers
```bash
# Run Backend API (from /backend)
npm run dev

# Install & Run Frontend (from /frontend)
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🌐 Cloud Deployment (Render)

### Backend Deployment:
1. Create a **Web Service** pointing to your repository.
2. Select **Root Directory** as `backend`.
3. Set **Build Command**: `npm install && chmod +x ./node_modules/.bin/prisma && npm run prisma:generate`
4. Set **Start Command**: `npm start`
5. In **Environment Variables**, paste all settings from `backend/.env`.

### Frontend Deployment:
1. Create a **Static Site** pointing to your repository.
2. Select **Root Directory** as `frontend`.
3. Set **Build Command**: `npm run build`
4. Set **Publish Directory**: `dist`
5. In **Redirects/Rewrites**, add:
   * **Source**: `/*`
   * **Destination**: `/index.html`
   * **Action**: `Rewrite`

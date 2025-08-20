# 🚀 Curvvtech Backend (MERN – Express + MongoDB)

A **Smart Device Management Backend** with authentication, device CRUD, logs, usage analytics, rate limiting, and background jobs.

---

## 🛠️ Tech Stack
- **Node.js + Express** – Web framework
- **MongoDB + Mongoose** – Database & ODM
- **JWT Authentication** – Secure user login
- **Zod Validation** – Schema validation
- **Rate Limiting** – `express-rate-limit` (100 req/min/user or IP)
- **Background Jobs** – `node-cron` (auto-deactivate inactive devices > 24h)
- **Docker & docker-compose** – Containerized setup
- **Testing** – Minimal with postman 

---

## ⚡ Quickstart

### 🔹 Local Development
```bash
cp .env.example .env
npm install
npm run dev

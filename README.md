# ⚡ AI Enterprise Workflow Suite

> A cloud-native, AI-powered workflow operating system engineered for intelligent task orchestration and decision support.

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Full%20Stack%20AI-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TS-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node%20%2B%20Prisma-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Gemini%202.5-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-orange?style=for-the-badge" />
</p>

---

## 🌐 Live System

🔗 https://ai-enterprise-workflow-suite.vercel.app/

---

## 🧠 Executive Summary

AI Enterprise Workflow Suite is a **distributed intelligent system** that transforms traditional task management into a **decision-driven workflow engine**.

Instead of storing tasks, the system:
- Interprets context
- Generates insights
- Assists decision-making through AI

---

## 🏗️ System Architecture


┌──────────────────────────┐
│ Frontend │
│ (React + Zustand) │
│ Hosted on Vercel │
└────────────┬────────────┘
│ HTTPS (Axios + JWT)
▼
┌──────────────────────────┐
│ Backend │
│ Node.js + Express │
│ Hosted on Render │
└────────────┬────────────┘
│ Prisma ORM
▼
┌──────────────────────────┐
│ Database │
│ Aiven MySQL │
└────────────┬────────────┘
│ Context Injection
▼
┌──────────────────────────┐
│ AI Engine │
│ Gemini 2.5 Flash │
└──────────────────────────┘


---

## 🔄 Data Flow Pipeline

### 1. UI Interaction
- User performs actions (task create / AI chat)
- Zustand manages real-time state

### 2. API Layer
- Axios sends request with JWT token
- Secure communication via HTTPS

### 3. Backend Processing
- Express handles request routing
- Middleware validates authentication
- Business logic executes

### 4. Database Layer
- Prisma performs type-safe queries
- MySQL persists structured data

### 5. AI Processing
- Task data injected into prompts
- Gemini returns contextual intelligence

---

## 🧩 Core Features

### 🔐 Authentication
- JWT-based stateless auth
- Auto-login via token validation
- Protected API routes

### 📊 Task Engine
- Full CRUD operations
- Category + risk classification
- Real-time updates

### 🧠 AI Assistant (Neural Brain)
- Context-aware chat
- Task-aware responses
- Anti-hallucination logic

### 📈 AI Advisor
- Task analysis
- Risk detection
- Executive-level insights

### 📄 Export System
- PDF report generation
- Snapshot of system state

---

## ⚙️ Tech Stack

### Frontend
- React (TypeScript)
- Zustand
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- MySQL (Aiven Cloud)

### AI
- Google Gemini 2.5 Flash

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure


Frontend/
src/
api/
components/
views/
store/
config/

Backend/
controllers/
routes/
models/
middleware/
prisma/
config/


---

## 🛠️ Local Development Setup

### Clone Repository
```bash
git clone https://github.com/Zishan-125/ai-enterprise-workflow-suite.git
cd ai-enterprise-workflow-suite
Backend Setup
cd Backend
npm install

npx prisma generate
npx prisma migrate dev --name init

npm run dev
Frontend Setup
cd Frontend
npm install
npm run dev
🔐 Environment Variables
Backend (.env)
PORT=5000
DATABASE_URL=your_mysql_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
Frontend (.env)
VITE_API_BASE_URL=https://ai-enterprise-workflow-suite.onrender.com
🔌 API Design
Auth
POST /api/auth/login
POST /api/auth/signup
Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
AI
POST /api/ai/chat
POST /api/ai/advisor
🧠 AI System Design
Chat Flow
User → Frontend → Backend → Gemini → Response → UI
Advisor Flow
Tasks → Backend → AI Analysis → Insight → Dashboard
Prompt Strategy
Inject real task data
Limit token output
Maintain structured responses
🚀 Performance Strategy
Stateless backend (scalable)
Minimal API payloads
Client-side token validation
Optimistic UI updates
🔐 Security
JWT authentication
Middleware-based route protection
Environment variable isolation
Token expiration handling
☁️ Deployment
Layer	Platform
Frontend	Vercel
Backend	Render
Database	Aiven
📊 Production Readiness
Cloud deployed
Secure authentication
AI integration
Scalable architecture
Clean modular design
🌍 Vision

To build a Neural Operating System for Workflows
where AI is not a feature — but the core decision engine.

👤 Author

Abdullah Al Mamun Zishan
CSE, Feni University

🔗 https://www.linkedin.com/in/abdullah-al-mamun-zishan-606550282

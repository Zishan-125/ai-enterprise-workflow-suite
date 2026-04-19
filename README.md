# ⚡ SmartDo — AI-Powered Enterprise Workflow Suite  
> *Engineering Intelligence into Every Task.*

<p align="center">
  <img src="https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif" width="420"/>
</p>

<p align="center">
  <strong>From Execution → Intelligence → Optimization</strong><br/>
  A cognitive workflow system designed for modern builders.
</p>

<p align="center">
  <a href="https://ai-enterprise-workflow-suite.vercel.app">
    <img src="https://img.shields.io/badge/🚀 Live%20App-Explore-black?style=for-the-badge">
  </a>
  <a href="https://ai-enterprise-workflow-suite.onrender.com">
    <img src="https://img.shields.io/badge/API-Operational-success?style=for-the-badge">
  </a>
</p>

---

## 🧠 Product Vision

**SmartDo** transforms traditional task tracking into an **AI-driven decision system**.

Instead of static task lists, it introduces:
- Predictive workflow intelligence  
- Real-time risk detection  
- AI-assisted execution strategy  

Built for **innovation ecosystems**, SmartDo acts as a **Neural Task Architect**—where every task becomes data, and every dataset becomes insight.

---

## 🏗️ System Architecture

## 🏗️ System Architecture

SmartDo follows a high-availability, distributed cloud architecture.

### 🛰️ Neural Request Lifecycle

sequenceDiagram
    participant U as User
    participant FE as React Frontend (Vercel)
    participant BE as Node.js Engine (Render)
    participant DB as MySQL (Aiven)
    participant AI as Gemini 2.5 Flash

    U->>FE: Updates Task Status to "High Risk"
    FE->>BE: PUT /api/tasks/:id (JWT Auth)
    BE->>BE: Verify Token & Sanitize Input
    BE->>DB: UPDATE tasks SET risk='High' WHERE id=X
    DB-->>BE: Success Confirmation
    
    Note over BE, AI: Cognitive Analysis Phase
    
    BE->>AI: POST /v1/models/gemini-1.5-flash (Current Context)
    AI-->>BE: Returns Strategic Neural Insight
    
    BE-->>FE: HTTP 200 (Updated Task + AI Insight)
    FE->>U: UI Update (Real-time View)


* **Frontend (Neural UI):** Built with **React 18** and **TypeScript**. Powered by **Vite** for sub-second hot module replacement.
* **Neural Engine (API):** A scalable **Node.js/Express** microservice hosted on **Render**, handling JWT authentication and encrypted data flow.
* **Database (Memory Cell):** An enterprise-grade **MySQL** instance hosted on **Aiven (Bangalore Cluster)**, ensuring ACID compliance.
* **Cognitive Layer (AI):** Integration with **Google Gemini AI** for real-time task risk assessment and strategic advising.

---



## 🛠️ Deployment Procedure (The "Zero-to-Cloud" Path)

<p align="center">
  <img src="https://img.shields.io/badge/Database-Aiven-blue?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render" />
  <img src="https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel" />
</p>

### 1. Database Provisioning (Aiven)
* Deploy a MySQL 8.0 instance.
* Configure **IP Whitelisting** to allow global cloud connections.
* Execute `schema.sql` to initialize task and user tables.

### 2. Backend Orchestration (Render)
* Link the GitHub repository and set the root directory to `/Backend`.
* Inject the `DATABASE_URL` and `JWT_SECRET` variables.
* Establish the `/api/ai/advisor` endpoint for Gemini integration.

### 3. Frontend Synthesis (Vercel)
* Configure the **Framework Preset** to **Vite**.
* Override build commands to bypass strict TS transpilation (`npx vite build`).
* Inject `VITE_API_BASE_URL` to link the UI to the Render cluster.

---

## 🚀 Key Features

* **⚡ Real-Time Sync:** MySQL persistence ensures your tasks live everywhere.
* **🧠 Neural Insights:** One-click AI advising to detect "High-Risk" nodes in your workflow.
* **🛡️ Secure Auth:** Robust JWT-based security with auto-logout on token expiration.
* **📊 Pro Analytics:** Export high-fidelity PDF audits for startup performance tracking.

---

## 🧩 Full Technology Stack (With Badges)

---

### 🎨 Frontend

<p align="center">

![React](https://img.shields.io/badge/React-UI-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Typed_JS-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-ff69b4?style=for-the-badge)

</p>

---

### ⚙️ Backend

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-Runtime-3C873A?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

</p>

---

### 🗄️ Database

<p align="center">

![MySQL](https://img.shields.io/badge/MySQL-Database-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Aiven](https://img.shields.io/badge/Aiven-Cloud_DB-orange?style=for-the-badge)

</p>

---

### 🤖 AI Layer

<p align="center">

![Gemini](https://img.shields.io/badge/Google-Gemini_AI-purple?style=for-the-badge&logo=google)

</p>

---

### 🔐 Authentication & API

<p align="center">

![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge)

</p>

---

### 🚀 Deployment

<p align="center">

![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render)

</p>

---

## 📦 Local Development

1. **Clone the Sector:**
   ```bash
   git clone [https://github.com/your-username/smartdo-suite.git](https://github.com/your-username/smartdo-suite.git)

---

2. **Initialize Engine (Backend):**
   ```bash
   cd Backend
   npm install
   npm start

---

3. **Initialize UI (Frontend):**
   ```bash
   cd Frontend
   npm install
   npm run dev

---

# 🌟 Live System

👉 https://ai-enterprise-workflow-suite.vercel.app/

---

## 👤 Author

**Abdullah Al Mamun Zishan**  
🎓 CSE, Feni University  
📚 Batch: CSE 31st (UG)  
🆔 ID: 232031009  

🔗 https://www.linkedin.com/in/abdullah-al-mamun-zishan-606550282

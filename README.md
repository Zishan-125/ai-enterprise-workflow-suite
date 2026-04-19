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

SmartDo follows a high-availability, distributed cloud architecture:

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

## 💻 Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, Axios |
| **ORM (Data Layer)** | Prisma |
| **Database** | MySQL (via Aiven) |
| **Deployment** | Vercel (UI), Render (API) |
| **AI** | Google Gemini 2.5 Flash |

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

## 👤 Author

**Abdullah Al Mamun Zishan**  
🎓 CSE, Feni University  
📚 Batch: CSE 31st (UG)  
🆔 ID: 232031009  

🔗 https://www.linkedin.com/in/abdullah-al-mamun-zishan-606550282

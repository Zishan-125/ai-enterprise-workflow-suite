# ⚡ SmartDo: AI-Powered Enterprise Workflow Suite
> The Neural Task Architect for the Modern Age.

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-enterprise-workflow-suite.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-EFEFEF?style=for-the-badge&logo=render)](https://ai-enterprise-workflow-suite.onrender.com)
[![Aiven](https://img.shields.io/badge/Database-Aiven%20MySQL-orange?style=for-the-badge&logo=aiven)](https://aiven.io)
[![Gemini](https://img.shields.io/badge/AI-Gemini%20Neural-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev)

**SmartDo** is a mission-critical task management ecosystem that bridges the gap between raw data and actionable AI insights. Designed for the Feni University Innovation Hub, it utilizes a proprietary "Neural Link" to analyze task risks, optimize startup velocity, and automate architectural auditing.

---

## 🏗️ System Architecture

SmartDo follows a high-availability, distributed cloud architecture:

* **Frontend (Neural UI):** Built with **React 18** and **TypeScript**. Powered by **Vite** for sub-second hot module replacement.
* **Neural Engine (API):** A scalable **Node.js/Express** microservice hosted on **Render**, handling JWT authentication and encrypted data flow.
* **Database (Memory Cell):** An enterprise-grade **MySQL** instance hosted on **Aiven (Bangalore Cluster)**, ensuring ACID compliance.
* **Cognitive Layer (AI):** Integration with **Google Gemini AI** for real-time task risk assessment and strategic advising.



---

## 🛠️ Deployment Procedure (The "Zero-to-Cloud" Path)

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
| **Database** | MySQL (via Aiven) |
| **Deployment** | Vercel (UI), Render (API) |
| **AI** | Google Gemini 1.5 Flash |

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

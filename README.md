<div align="center">
<h1>🛍️ CoDeSMerch</h1>
 
**Merchandise management system for the Computer Development Society.**
 
A full-stack web application built with React, Node.js, and Flask — featuring role-based dashboards, inventory management, point-of-sale, sales analytics, and ML-powered demand forecasting.
 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
 
</div>
---
 
## 📖 About
 
**CoDeSMerch** is a full-stack merchandise management system built for the **Computer Development Society (CoDES)**. It provides officers and admins with a centralized dashboard to manage merchandise inventory, process sales through a built-in POS, track revenue, manage events, and forecast future demand using machine learning — all in one place. Authentication is role-based, supporting roles such as Super Admin, President, Vice President, Officers, and more.
 
---
 
## ✨ Features
 
**🔐 Authentication & Access Control**
- Role-based access via Firebase Auth
- Supported roles: Super Admin, President, Vice President, Officer, Secretary, Treasurer, PIO
- Activity logging per user session
**📦 Product Management**
- Add, update, and delete merchandise products
- Image uploads via Supabase Storage
- Low stock alert monitoring
**🧾 Point of Sale (POS)**
- In-dashboard POS interface for processing sales transactions
- Real-time transaction recording
**📊 Sales Analytics & Revenue**
- Visual charts and breakdowns of sales performance
- Revenue tracking over time
- Performance reports per product and event
**📈 Demand Forecasting**
- ML-powered forecasting using linear regression (Flask + scikit-learn)
- Trend prediction and demand horizon estimates
- Forecast accuracy comparison across events
**🎪 Events Management**
- Create and manage organization events
- Tie merchandise sales to specific events
**📋 Reports**
- Generate and export reports to Excel (via ExcelJS)
- Transaction and sales history views
**👥 Team Management**
- View and manage organization members and their assigned roles
---
 
## 💻 Prerequisites
 
Make sure you have the following installed:
 
- Node.js >= 18
- Python >= 3.10
- npm or yarn
- A Firebase project (Auth + Realtime Database enabled)
- A Supabase project (Storage bucket configured)
- Git
---
 
## 🚀 Getting Started
 
1. Clone the repository:
```bash
git clone https://github.com/Eldri06/CoDeSMerchF.git
```
 
2. Navigate into the project:
```bash
cd CoDeSMerchF
```
 
3. Install frontend dependencies:
```bash
npm install
```
 
4. Copy the environment file and configure it:
```bash
cp .env.example .env
```
 
5. Start the frontend dev server:
```bash
npm run dev
```
 
6. In a new terminal, set up and start the Node.js backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
 
7. In another terminal, install Python dependencies and start the forecasting service:
```bash
pip install -r requirements.txt
python app.py
```
 
> ⚠️ Configure your Firebase and Supabase credentials in both `.env` files before running. See [Environment Variables](#-environment-variables) below.
 
---
 
## 🔑 Environment Variables
 
Create a `.env` file in the **root** directory:
 
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
 
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_SERVICE_ROLE_KEY=
```
 
Create a `.env` file in the **`backend/`** directory:
 
```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173
 
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
 
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
 
SENDGRID_API_KEY=
```
 
> ⚠️ Never commit `.env` files to version control. Both are already included in `.gitignore`.
 
---
 
## 🤝 Contributors
 
| Name | Role | GitHub |
|------|------|--------|
| Eldrian Colinares | Fullstack Developer | [@Eldri06](https://github.com/Eldri06) |
 
---
 
## 📄 License
 
This project was developed for academic purposes. All rights reserved by the CoDeSMerch team.
 
<br>
<div align="center">
  <sub>Built with 🛍️ and ☕ by Eldrian </sub>
</div>
 

# AI-Powered RFP Management System

## 📋 Project Context
This project is a single-user web application designed to streamline the procurement process. It allows procurement managers to:
1.  **Create RFPs** (Request for Proposals) using natural language.
2.  **AI Parsing:** Automatically convert text requirements into structured data (Items, Budget, Deadline).
3.  **Vendor Management:** Maintain a vendor database.
4.  **Email Integration:** Send RFPs to vendors via email and automatically fetch/parse their email replies.
5.  **AI Evaluation:** Compare vendor proposals side-by-side using AI-extracted data (Price, Terms, Deviations).

---

## 🛠️ Tech Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Supabase)
* **ORM:** Sequelize
* **AI Integration:** Google Gemini API (`@google/generative-ai`)
* **Email Sending:** Nodemailer (SMTP)
* **Email Receiving:** Imap-Simple & Mailparser

### Frontend
* **Framework:** React.js (Vite)
* **HTTP Client:** Axios
* **Routing:** React Router DOM
* **Styling:** Custom CSS (Dark Mode / SaaS Theme)

---

## ⚙️ Project Setup & Installation

### 1. Prerequisites
* Node.js (v16 or higher) installed.
* A **Supabase** account (or any PostgreSQL database).
* A **Google Gemini API Key** (Free tier via Google AI Studio).
* A **Gmail Account** for sending/receiving emails.
    * *Note:* You must enable **2-Factor Authentication** and generate an **App Password** to use Gmail with Nodemailer. You also need to enable **IMAP** in Gmail settings.

### 2. Environment Configuration
Create a `.env` file inside the `backend/` folder.
**Do not share this file.** Use the format below:

```env
# --- Backend Configuration ---
PORT=3001

# --- Database Configuration (PostgreSQL) ---
# Replace with your actual Supabase/Postgres connection string
DB_URL=postgresql://postgres.user:password@aws-0-region.pooler.supabase.com:5432/postgres

# --- AI/LLM Provider ---
# Get this from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here

# --- Email Configuration ---
# Used for sending RFPs and reading replies via IMAP
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```
### 3. Installation Setup
Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```
### 4. Running the Application
You need to run both the backend and frontend terminals simultaneously.

Terminal 1 (Backend):

```bash

cd backend
node index.js
```
Terminal 2 (Frontend):

```bash

cd frontend
npm run dev
```
#### Open your browser and navigate to http://localhost:5173.

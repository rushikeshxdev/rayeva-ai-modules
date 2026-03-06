# 🌱 Rayeva AI Modules Dashboard

> AI-powered backend system for sustainable e-commerce — built as an internship assignment for **Rayeva World Pvt Ltd**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 📌 What is this?

Rayeva sells eco-friendly products. This project automates 4 of their most manual tasks using **Google Gemini AI**:

| Module | Problem Solved |
|--------|---------------|
| 🏷️ Product Tagger | Auto-categorize products + generate SEO tags |
| 💼 B2B Proposal Generator | Create bulk purchase proposals within budget |
| 🌍 Impact Report | Calculate plastic saved + carbon avoided per order |
| 💬 WhatsApp Bot | Answer customer queries via WhatsApp automatically |

---

## 🏗️ Architecture
```
React Frontend (Vite + Tailwind)
         │
         │  HTTP/JSON
         ▼
FastAPI Backend (Python 3.11)
    ├── /api/categorize-product      → Module 1
    ├── /api/generate-proposal       → Module 2
    ├── /api/generate-impact-report  → Module 3
    └── /api/whatsapp/webhook        → Module 4
         │
    ┌────┴────────────┐
    │                 │
AI Modules        SQLite DB
(Google Gemini)   (7 tables)
```

---

## 🤖 How Each Module Works

<details>
<summary><b>🏷️ Module 1 — Product Tagger</b></summary>
<br>

**Input:** Product name + description
**What AI does:** Assigns category, sub-category, SEO tags, sustainability filters

**Example Input:**
```json
{
  "product_name": "BambooFresh Toothbrush",
  "product_description": "Biodegradable bamboo, plastic-free packaging"
}
```

**Example Output:**
```json
{
  "category": "Personal Care",
  "sub_category": "Oral Hygiene",
  "seo_tags": ["bamboo toothbrush", "plastic-free", "eco toothbrush"],
  "sustainability_filters": ["plastic-free", "biodegradable"],
  "confidence_score": 0.95
}
```

**Prompt Strategy:** Role-based prompting with predefined category list, strict JSON output enforced, temperature 0.3 for consistency

</details>

<details>
<summary><b>💼 Module 2 — B2B Proposal Generator</b></summary>
<br>

**Input:** Client name, industry, budget (INR), number of employees, preferences

**Example Input:**
```json
{
  "client_name": "GreenTech Pvt Ltd",
  "industry": "Technology",
  "budget": 50000,
  "num_employees": 50,
  "preferences": ["plastic-free", "recycled"]
}
```

**Example Output:**
```json
{
  "recommended_products": [
    {
      "product_name": "Bamboo Desk Organizer",
      "category": "Office & Stationery",
      "quantity": 50,
      "unit_price": 299,
      "total_price": 14950,
      "sustainability_features": ["plastic-free", "biodegradable"]
    }
  ],
  "total_cost": 49850,
  "budget_utilization_percent": 99.7,
  "impact_summary": "Eliminates approximately 600 single-use plastic items",
  "impact_positioning": "Perfect for ESG goals and CSR reporting"
}
```

**Prompt Strategy:** Gemini acts as B2B sales consultant, explicitly constrained to budget, aims for 90-100% budget utilization, temperature 0.5

</details>

<details>
<summary><b>🌍 Module 3 — Impact Report Generator</b></summary>
<br>

**Input:** Order ID + list of products with sustainability attributes

**Two-step approach — Python calculates first, AI writes last:**
```
Step 1 (Python math — no AI guessing):
  plastic_saved_grams  = weight × quantity × 0.8   (plastic-free items)
  carbon_avoided_kg    = weight × quantity × 0.002  (local/organic items)
  local_sourcing_%     = local_items / total × 100

Step 2 (Gemini writes human-readable statement):
  "Your order saved 144g of plastic — like removing
   96 straws from the ocean! 🌊"
```

**Example Output:**
```json
{
  "plastic_saved_grams": 144.0,
  "carbon_avoided_kg": 0.36,
  "local_sourcing_percent": 50.0,
  "impact_statement": "Amazing! Your order saved 144g of plastic..."
}
```

**Prompt Strategy:** Two-step processing, AI only handles communication not math, temperature 0.7 for warm engaging tone, max 500 tokens

</details>

<details>
<summary><b>💬 Module 4 — WhatsApp Support Bot</b></summary>
<br>

**Input:** Twilio webhook POST (customer WhatsApp message)

**Flow:**
```
Customer WhatsApps → Twilio → POST /api/whatsapp/webhook
         │
         ▼
AI detects intent (one of 4 categories)
         │
    ┌────┴──────────────────────────────┐
    │            │           │          │
order_status  return_    refund_    general
              policy    escalation
    │            │           │          │
Query DB    Hardcoded    Log to DB   AI generates
for order   policy text  alert team  response
    │            │           │          │
    └────────────┴───────────┴──────────┘
         │
         ▼
Format as TwiML XML → Twilio → Customer's WhatsApp
```

**Test it with seed orders:**
- `"Where is my order ORD-001?"` → order found, status returned
- `"What is your return policy?"` → policy text returned
- `"I want a refund now!"` → escalation created, team alerted

**Prompt Strategy:** Strict single-word classification, temperature 0.3, always falls back to "general" on failure

</details>

---

## 🚀 Quick Start

### Backend
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/rayeva-ai-modules.git
cd rayeva-ai-modules

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 4. Install dependencies
pip install -r requirements.txt

# 5. Setup environment
cp .env.example .env
# Open .env and add your GEMINI_API_KEY

# 6. Seed database with test orders
python seed_data.py

# 7. Start server
uvicorn main:app --reload
```

**API docs →** `http://127.0.0.1:8000/docs`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Dashboard →** `http://localhost:5173`

---

## 📡 API Reference

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/categorize-product` | 1 | Tag a product with AI |
| `GET` | `/api/products` | 1 | List all tagged products |
| `POST` | `/api/generate-proposal` | 2 | Generate B2B proposal |
| `GET` | `/api/proposals` | 2 | List all proposals |
| `POST` | `/api/generate-impact-report` | 3 | Calculate order impact |
| `GET` | `/api/impact-reports` | 3 | List all impact reports |
| `POST` | `/api/whatsapp/webhook` | 4 | Twilio webhook handler |
| `GET` | `/api/whatsapp/logs` | 4 | View conversations |
| `GET` | `/api/escalations` | 4 | View escalations |

---

## 🗄️ Database Schema
```
product_tags       → Module 1 outputs (category, tags, filters)
b2b_proposals      → Module 2 outputs (products, costs, impact)
impact_reports     → Module 3 outputs (metrics, statement)
orders             → Seed data for WhatsApp bot testing
whatsapp_logs      → Module 4 conversations (intent, response)
escalation_logs    → Flagged customer issues (pending/resolved)
ai_logs            → Every AI call logged (prompt + response + success)
```

---

## ⚙️ Environment Variables
```bash
# .env.example

# Required — get free key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=

# Optional — only needed for live WhatsApp testing
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Frontend
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 📁 Project Structure
```
rayeva-ai/
├── modules/
│   ├── module1_tagger.py        # AI product categorization
│   ├── module2_proposal.py      # AI B2B proposal generation
│   ├── module3_impact.py        # Python math + AI statements
│   └── module4_whatsapp.py      # Intent detection + routing
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── ProductTagger.jsx
│       │   ├── ProposalGenerator.jsx
│       │   ├── ImpactReport.jsx
│       │   └── WhatsAppBot.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── JsonDisplay.jsx
│       └── api/
│           └── client.js
│
├── main.py                      # All FastAPI routes + CORS
├── models.py                    # 7 SQLAlchemy table definitions
├── database.py                  # SQLite engine + session
├── seed_data.py                 # 5 dummy orders for testing
├── requirements.txt
└── .env.example
```
---

## 🌱 Seed Data (for testing WhatsApp bot)

| Order | Customer | Product | Status |
|-------|----------|---------|--------|
| ORD-001 | Priya Sharma | Bamboo Toothbrush × 2 | Delivered |
| ORD-002 | Rahul Mehta | Reusable Water Bottle × 1 | Shipped |
| ORD-003 | Ananya Singh | Organic Cotton Tote × 3 | Processing |
| ORD-004 | Vikram Patel | Compostable Plates × 10 | Delivered |
| ORD-005 | Sneha Joshi | Beeswax Food Wraps × 5 | Shipped |

---

<div align="center">

Built by Rushikesh Randive to automate sustainable commerce with AI 🌱 · Full Stack / AI Intern · Rayeva World Pvt Ltd · 2026

</div>

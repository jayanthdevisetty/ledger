# FMS — Financial Management System

A production-grade, mobile-first full-stack accounting application for a Tent House / Shamiyana business.

## Features

- **Dashboard** — Live summary cards, monthly chart, recent transactions
- **Transactions** — Full CRUD with custom IDs (FMS-TENT-XXXX, FMS-CHITI-XXXX), search, filters, pagination
- **Monthly Expenses** — Recurring expenses with Paid/Pending status affecting balance
- **Person Ledger** — Search any person, view total given/received/balance
- **Reports** — Daily/Weekly/Monthly/Yearly with CSV export & print
- **Dark Mode** — Full dark theme support
- **Mobile-First** — Bottom nav, FAB, card-based UI, full-screen forms

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18 (Vite), TailwindCSS, Framer Motion, Recharts, Lucide React |
| Backend  | Node.js, Express.js |
| Database | MongoDB Atlas |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (connection string provided in `.env`)

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` with API proxy to backend.

### Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://shaikbashah20_db_user:AnMeB5cqR5qdUVk5@cluster2049.iftvpvt.mongodb.net/fms?retryWrites=true&w=majority
NODE_ENV=development
```

## API Endpoints

### Transactions
- `POST /api/transactions` — Create transaction
- `GET /api/transactions` — List (pagination, search, filters)
- `GET /api/transactions/:id` — Get by MongoDB ID
- `GET /api/transactions/code/:transactionId` — Get by custom ID
- `PUT /api/transactions/:id` — Update
- `DELETE /api/transactions/:id` — Delete

### Expenses
- `POST /api/expenses` — Create
- `GET /api/expenses` — List (filter by month/year)
- `PUT /api/expenses/:id` — Update
- `DELETE /api/expenses/:id` — Delete

### Dashboard
- `GET /api/dashboard/summary` — Full dashboard data

### Reports
- `GET /api/reports?period=monthly&date=2026-05-15` — Report data

### Ledger
- `GET /api/ledger` — All persons with summaries
- `GET /api/ledger/:personName` — Person ledger detail

## Balance Calculation

```
Tent House Balance = Tent House Income - Tent House Expenses - Paid Common Expenses
Chiti Balance      = Chiti Income - Chiti Expenses
Overall Balance    = Tent House Balance + Chiti Balance
```

## Project Structure

```
fms/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

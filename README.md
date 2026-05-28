# SpendWise — Multi-page Finance Tracker

A college-level personal finance web app built with **HTML**, **CSS**, and **vanilla JavaScript**. Data is stored in **localStorage** only — no real backend.

## Pages

| Page | Features |
|------|----------|
| **Login** | Frontend-only sign-in (any email/password) |
| **Dashboard** | Balance, charts, recent transactions, activity feed |
| **Transactions** | CRUD, search, filters, sort, CSV export |
| **Budget** | Monthly + category limits, progress bars, warnings |
| **Analytics** | Pie/line/bar charts, savings insights |
| **Settings** | Profile, currency, theme, reset data |

## Folder structure

```
expense-tracker/
├── index.html              # Redirects to login or dashboard
├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── transactions.html
│   ├── budget.html
│   ├── analytics.html
│   └── settings.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js              # Shared init & data loading
│   ├── config.js
│   ├── storage.js
│   ├── api.js              # async/await mock API
│   ├── auth.js
│   ├── transactions.js
│   ├── budget.js
│   ├── chart.js
│   ├── csv.js
│   ├── components/
│   │   ├── layout.js       # Sidebar + mobile menu
│   │   ├── toast.js
│   │   ├── skeleton.js
│   │   ├── empty-state.js
│   │   ├── forms.js
│   │   └── transaction-list.js
│   └── pages/              # One script per page
└── README.md
```

## How to run

```bash
cd ~/Projects/expense-tracker
npx serve .
```

Open the URL shown (e.g. `http://localhost:3000`), then go to **Login**.

**Demo login:** any email and password.

## Tech notes

- ES modules, Chart.js via CDN
- `async/await` in `api.js` for mock login and starter data
- Responsive sidebar with hamburger menu on mobile
- Toast notifications for user actions

## Reset data

Settings → **Reset everything**, or clear browser storage for the site.

import { CATEGORIES, INCOME_CATEGORY, generateId } from './config.js';

function getDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EXPENSE_SAMPLES = [
  ['Mess food', 'Food', 120, 450],
  ['Bus pass', 'Travel', 80, 200],
  ['Stationery', 'Education', 150, 600],
  ['Netflix', 'Entertainment', 199, 499],
  ['Groceries', 'Shopping', 200, 800],
  ['Electricity bill', 'Bills', 300, 900],
  ['Coffee', 'Food', 40, 120],
  ['Uber ride', 'Travel', 90, 350],
  ['Medicine', 'Health', 100, 400],
];

/** Builds a realistic-ish transaction list for demo */
export function generateDummyTransactions(count = 28) {
  const list = [
    {
      id: generateId(),
      type: 'income',
      description: 'Part-time campus job',
      amount: 4500,
      category: INCOME_CATEGORY,
      date: getDaysAgo(2),
    },
    {
      id: generateId(),
      type: 'income',
      description: 'Freelance design gig',
      amount: 1200,
      category: INCOME_CATEGORY,
      date: getDaysAgo(18),
    },
  ];

  for (let i = 0; i < count; i++) {
    const sample = EXPENSE_SAMPLES[i % EXPENSE_SAMPLES.length];
    const [desc, category, minAmt, maxAmt] = sample;
    const amount = Math.round(minAmt + Math.random() * (maxAmt - minAmt));
    const dayOffset = Math.floor(Math.random() * 45);

    list.push({
      id: generateId(),
      type: 'expense',
      description: desc,
      amount,
      category: CATEGORIES.includes(category) ? category : 'Other',
      date: getDaysAgo(dayOffset),
    });
  }

  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function fetchUserProfile() {
  await delay(300);
  return {
    name: 'Alex Kumar',
    email: 'alex.kumar@college.edu',
    memberSince: '2025-09',
  };
}

export async function fetchStarterData() {
  await delay(500);
  return generateDummyTransactions(24);
}

export async function syncTransactions(transactions) {
  await delay(120);
  return { ok: true, count: transactions.length };
}

export async function loginUser(email, password) {
  await delay(400);
  if (!email.trim()) throw new Error('Email is required');
  return {
    loggedIn: true,
    email: email.trim(),
    token: 'demo_' + Date.now(),
  };
}

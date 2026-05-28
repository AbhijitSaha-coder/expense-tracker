import { generateId } from './config.js';

export function calculateTotals(transactions) {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') income += amount;
    else expense += amount;
  }
  return { income, expense, balance: income - expense };
}

export function getCurrentYearMonth() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

export function getMonthlyExpenseTotal(transactions, yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return transactions
    .filter((tx) => {
      if (tx.type !== 'expense') return false;
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

export function getExpensesByCategory(transactions, yearMonth = null) {
  const totals = {};
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue;
    if (yearMonth) {
      const [year, month] = yearMonth.split('-').map(Number);
      const d = new Date(tx.date);
      if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue;
    }
    const cat = tx.category || 'Other';
    totals[cat] = (totals[cat] || 0) + Number(tx.amount);
  }
  return totals;
}

export function getHighestSpendingCategory(transactions, yearMonth) {
  const totals = getExpensesByCategory(transactions, yearMonth);
  let maxCat = null;
  let maxVal = 0;
  for (const [cat, val] of Object.entries(totals)) {
    if (val > maxVal) {
      maxVal = val;
      maxCat = cat;
    }
  }
  return { category: maxCat, amount: maxVal };
}

export function getWeeklyExpenseTrend(transactions, weeks = 6) {
  const labels = [];
  const values = [];
  const now = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(now);
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    const label = `${start.getDate()}/${start.getMonth() + 1}`;
    labels.push(label);

    const total = transactions
      .filter((tx) => {
        if (tx.type !== 'expense') return false;
        const d = new Date(tx.date);
        return d >= start && d <= end;
      })
      .reduce((s, tx) => s + Number(tx.amount), 0);

    values.push(total);
  }

  return { labels, values };
}

export function getMonthlyTrend(transactions, months = 6) {
  const labels = [];
  const values = [];
  const now = new Date();

  for (let m = months - 1; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(d.toLocaleDateString('en-IN', { month: 'short' }));
    values.push(getMonthlyExpenseTotal(transactions, ym));
  }

  return { labels, values };
}

export function addTransaction(transactions, data) {
  return [
    {
      id: generateId(),
      type: data.type,
      description: data.description.trim(),
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
    },
    ...transactions,
  ];
}

export function updateTransaction(transactions, id, data) {
  return transactions.map((tx) =>
    tx.id === id
      ? {
          ...tx,
          type: data.type,
          description: data.description.trim(),
          amount: Number(data.amount),
          category: data.category,
          date: data.date,
        }
      : tx
  );
}

export function deleteTransaction(transactions, id) {
  return transactions.filter((tx) => tx.id !== id);
}

export function filterTransactions(
  transactions,
  { search = '', category = 'all', dateFrom = '', dateTo = '' } = {}
) {
  const query = search.trim().toLowerCase();

  return transactions.filter((tx) => {
    const matchesCategory = category === 'all' || tx.category === category;
    const matchesSearch =
      !query ||
      tx.description.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query);
    const matchesFrom = !dateFrom || tx.date >= dateFrom;
    const matchesTo = !dateTo || tx.date <= dateTo;
    return matchesCategory && matchesSearch && matchesFrom && matchesTo;
  });
}

export function sortTransactions(transactions, sortBy = 'latest') {
  const list = [...transactions];
  switch (sortBy) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'amount-high':
      return list.sort((a, b) => Number(b.amount) - Number(a.amount));
    case 'amount-low':
      return list.sort((a, b) => Number(a.amount) - Number(b.amount));
    default:
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export function getRecentTransactions(transactions, limit = 5) {
  return sortTransactions(transactions, 'latest').slice(0, limit);
}

export function getCategorySpentThisMonth(transactions, category) {
  const ym = getCurrentYearMonth();
  const [year, month] = ym.split('-').map(Number);
  return transactions
    .filter((tx) => {
      if (tx.type !== 'expense' || tx.category !== category) return false;
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((s, tx) => s + Number(tx.amount), 0);
}

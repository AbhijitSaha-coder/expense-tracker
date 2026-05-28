import {
  ensureAppData,
  getBudgetState,
  getTransactions,
  initPage,
} from '../app.js';
import { getOverallBudgetStatus } from '../budget.js';
import { formatCurrency } from '../config.js';
import { renderRecentList } from '../components/transaction-list.js';
import { renderCardSkeletons } from '../components/skeleton.js';
import {
  calculateTotals,
  getCurrentYearMonth,
  getExpensesByCategory,
  getMonthlyExpenseTotal,
  getRecentTransactions,
  sortTransactions,
} from '../transactions.js';
import { renderDoughnutChart } from '../chart.js';

const page = initPage({ pageId: 'dashboard', title: 'Dashboard' });
if (!page) throw new Error('Auth required');

async function render() {
  const skeleton = document.getElementById('stat-skeleton');
  const cards = document.getElementById('stat-cards');
  renderCardSkeletons(skeleton, 4);

  await ensureAppData();
  const transactions = getTransactions();
  const { monthlyLimit } = getBudgetState();

  skeleton.innerHTML = '';
  cards.classList.remove('hidden');

  const totals = calculateTotals(transactions);
  const monthly = getMonthlyExpenseTotal(transactions, getCurrentYearMonth());

  document.getElementById('stat-balance').textContent = formatCurrency(totals.balance);
  document.getElementById('stat-income').textContent = formatCurrency(totals.income);
  document.getElementById('stat-expense').textContent = formatCurrency(totals.expense);
  document.getElementById('stat-monthly').textContent = formatCurrency(monthly);

  const overall = getOverallBudgetStatus(transactions, monthlyLimit);
  document.getElementById('budget-alert').classList.toggle('hidden', !overall.exceeded);

  const categoryTotals = getExpensesByCategory(transactions, getCurrentYearMonth());
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  const hasChart = renderDoughnutChart('dash-chart', labels, values, formatCurrency);
  document.getElementById('dash-chart-empty').classList.toggle('hidden', hasChart);
  document.getElementById('dash-chart').classList.toggle('hidden', !hasChart);

  const recent = getRecentTransactions(transactions, 6);
  const recentList = document.getElementById('recent-list');
  if (recent.length === 0) {
    recentList.innerHTML = '<li class="list-empty-msg">No transactions yet — <a href="transactions.html">add one</a>.</li>';
  } else {
    renderRecentList(recentList, recent);
  }

  const activity = document.getElementById('activity-feed');
  activity.innerHTML = '';
  const sorted = sortTransactions(transactions, 'latest').slice(0, 10);
  for (const tx of sorted) {
    const li = document.createElement('li');
    li.className = 'activity-item';
    const verb = tx.type === 'income' ? 'Received' : 'Spent';
    li.innerHTML = `
      <div>${verb} <strong>${tx.description}</strong> — ${formatCurrency(tx.amount)}</div>
      <time>${tx.date}</time>
    `;
    activity.appendChild(li);
  }
}

render();

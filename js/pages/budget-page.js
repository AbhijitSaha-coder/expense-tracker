import {
  ensureAppData,
  getBudgetState,
  getTransactions,
  initPage,
} from '../app.js';
import { getCategoryBudgetStatus, getOverallBudgetStatus } from '../budget.js';
import { CATEGORIES, formatCurrency } from '../config.js';
import { showToast } from '../components/toast.js';
import {
  loadCategoryBudgets,
  saveBudgetLimit,
  saveCategoryBudgets,
} from '../storage.js';

const page = initPage({ pageId: 'budget', title: 'Budget Planner' });
if (!page) throw new Error('Auth required');

function renderOverall(transactions, monthlyLimit) {
  const status = getOverallBudgetStatus(transactions, monthlyLimit);
  const bar = document.getElementById('overall-progress-bar');
  const text = document.getElementById('overall-progress-text');
  const alert = document.getElementById('overall-alert');

  text.textContent = `${formatCurrency(status.spent)} / ${formatCurrency(status.limit)}`;
  bar.style.width = `${status.percent}%`;
  bar.className = 'budget-row__fill';
  if (status.exceeded) bar.classList.add('budget-row__fill--over');
  else if (status.percent >= 80) bar.classList.add('budget-row__fill--warn');

  if (status.exceeded) {
    alert.textContent = `Warning: You've exceeded your monthly limit by ${formatCurrency(status.spent - status.limit)}.`;
    alert.classList.remove('hidden');
  } else {
    alert.classList.add('hidden');
  }
}

function renderCategoryProgress(transactions, categoryBudgets) {
  const container = document.getElementById('category-progress-list');
  container.innerHTML = '';

  const rows = getCategoryBudgetStatus(transactions, categoryBudgets).filter((r) => r.limit > 0);

  if (rows.length === 0) {
    container.innerHTML = '<p class="list-empty-msg">Set category limits above to see progress bars.</p>';
    return;
  }

  for (const row of rows) {
    const div = document.createElement('div');
    div.className = 'budget-row';
    let fillClass = 'budget-row__fill';
    if (row.exceeded) fillClass += ' budget-row__fill--over';
    else if (row.percent >= 80) fillClass += ' budget-row__fill--warn';

    div.innerHTML = `
      <div class="budget-row__head">
        <span>${row.category}</span>
        <span>${formatCurrency(row.spent)} / ${formatCurrency(row.limit)}</span>
      </div>
      <div class="budget-row__bar">
        <div class="${fillClass}" style="width: ${row.percent}%"></div>
      </div>
    `;
    if (row.exceeded) {
      const warn = document.createElement('p');
      warn.style.cssText = 'font-size:0.8rem;color:var(--expense);margin-top:0.25rem;';
      warn.textContent = 'Over budget for this category';
      div.appendChild(warn);
    }
    container.appendChild(div);
  }
}

function buildCategoryForm(budgets) {
  const form = document.getElementById('category-budget-form');
  form.innerHTML = '';

  for (const cat of CATEGORIES) {
    const row = document.createElement('div');
    row.className = 'budget-category-item';
    row.innerHTML = `
      <label for="budget-${cat}">${cat}</label>
      <input type="number" id="budget-${cat}" data-category="${cat}" min="0" step="100"
        value="${budgets[cat] || ''}" placeholder="0">
    `;
    form.appendChild(row);
  }
}

async function init() {
  await ensureAppData();
  const transactions = getTransactions();
  const { monthlyLimit, categoryBudgets } = getBudgetState();

  document.getElementById('monthly-limit').value = monthlyLimit || '';
  buildCategoryForm(categoryBudgets);
  renderOverall(transactions, monthlyLimit);
  renderCategoryProgress(transactions, categoryBudgets);

  document.getElementById('save-monthly-btn').addEventListener('click', () => {
    const limit = Number(document.getElementById('monthly-limit').value) || 0;
    saveBudgetLimit(limit);
    renderOverall(getTransactions(), limit);
    showToast('Monthly limit saved', 'success');
  });

  document.getElementById('save-categories-btn').addEventListener('click', () => {
    const budgets = {};
    for (const cat of CATEGORIES) {
      const input = document.getElementById(`budget-${cat}`);
      const val = Number(input.value);
      if (val > 0) budgets[cat] = val;
    }
    saveCategoryBudgets(budgets);
    renderCategoryProgress(getTransactions(), budgets);
    showToast('Category budgets saved', 'success');
  });
}

init();

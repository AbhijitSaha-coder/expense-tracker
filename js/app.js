import { fetchStarterData, syncTransactions } from './api.js';
import { requireAuth } from './auth.js';
import { initTheme, injectLayout, setPageTitle } from './components/layout.js';
import {
  loadBudgetLimit,
  loadCategoryBudgets,
  loadTransactions,
  saveBudgetLimit,
  saveCategoryBudgets,
  saveTransactions,
} from './storage.js';

let transactionsCache = null;

export async function ensureAppData() {
  if (transactionsCache) return transactionsCache;

  let transactions = loadTransactions();
  if (transactions.length === 0) {
    transactions = await fetchStarterData();
    saveTransactions(transactions);

    const defaultBudgets = {
      Food: 3000,
      Travel: 1500,
      Shopping: 2000,
      Bills: 2500,
      Entertainment: 1000,
    };
    saveCategoryBudgets(defaultBudgets);
    saveBudgetLimit(12000);
  }

  transactionsCache = transactions;
  return transactions;
}

export function getTransactions() {
  return transactionsCache || loadTransactions();
}

export function setTransactions(transactions) {
  transactionsCache = transactions;
  saveTransactions(transactions);
}

export async function persistTransactions(transactions) {
  setTransactions(transactions);
  await syncTransactions(transactions);
}

export function initPage({ pageId, title, requireLogin = true }) {
  initTheme();
  if (requireLogin && !requireAuth()) return null;

  injectLayout(pageId);
  setPageTitle(title);
  return document.getElementById('page-body');
}

export async function loadPageWithSkeleton(renderFn, skeletonEl, skeletonRows = 5) {
  const { showSkeleton, hideSkeleton } = await import('./components/skeleton.js');
  if (skeletonEl) showSkeleton(skeletonEl, skeletonRows);

  await ensureAppData();
  const result = await renderFn();

  if (skeletonEl) hideSkeleton(skeletonEl);
  return result;
}

export function getBudgetState() {
  return {
    monthlyLimit: loadBudgetLimit(),
    categoryBudgets: loadCategoryBudgets(),
  };
}

import { STORAGE_KEYS } from './config.js';

export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTransactions() {
  return loadFromStorage(STORAGE_KEYS.transactions, []);
}

export function saveTransactions(transactions) {
  saveToStorage(STORAGE_KEYS.transactions, transactions);
}

export function loadBudgetLimit() {
  const value = loadFromStorage(STORAGE_KEYS.budget, null);
  return value === null ? 0 : Number(value);
}

export function saveBudgetLimit(limit) {
  saveToStorage(STORAGE_KEYS.budget, limit);
}

export function loadCategoryBudgets() {
  return loadFromStorage(STORAGE_KEYS.categoryBudgets, {});
}

export function saveCategoryBudgets(budgets) {
  saveToStorage(STORAGE_KEYS.categoryBudgets, budgets);
}

export function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

export function loadCurrency() {
  return localStorage.getItem(STORAGE_KEYS.currency) || 'INR';
}

export function saveCurrency(code) {
  localStorage.setItem(STORAGE_KEYS.currency, code);
}

export function loadUser() {
  return loadFromStorage(STORAGE_KEYS.user, {
    name: 'Student User',
    email: 'student@college.edu',
  });
}

export function saveUser(user) {
  saveToStorage(STORAGE_KEYS.user, user);
}

export function loadAuth() {
  return loadFromStorage(STORAGE_KEYS.auth, { loggedIn: false });
}

export function saveAuth(auth) {
  saveToStorage(STORAGE_KEYS.auth, auth);
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

/** App-wide constants */
export const STORAGE_KEYS = {
  transactions: 'spendwise_transactions',
  budget: 'spendwise_budget',
  categoryBudgets: 'spendwise_category_budgets',
  theme: 'spendwise_theme',
  currency: 'spendwise_currency',
  user: 'spendwise_user',
  auth: 'spendwise_auth',
};

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Entertainment',
  'Health',
  'Other',
];

export const INCOME_CATEGORY = 'Salary';
export const ALL_CATEGORIES = [...CATEGORIES, INCOME_CATEGORY];

export const CURRENCIES = {
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '▣' },
  { id: 'transactions', label: 'Transactions', href: 'transactions.html', icon: '⇄' },
  { id: 'budget', label: 'Budget', href: 'budget.html', icon: '◎' },
  { id: 'analytics', label: 'Analytics', href: 'analytics.html', icon: '◔' },
  { id: 'settings', label: 'Settings', href: 'settings.html', icon: '⚙' },
];

export function getCurrencyCode() {
  return localStorage.getItem(STORAGE_KEYS.currency) || 'INR';
}

export function formatCurrency(amount) {
  const code = getCurrencyCode();
  const { symbol, locale } = CURRENCIES[code] || CURRENCIES.INR;
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${symbol}${value.toFixed(2)}`;
  }
}

export function generateId(prefix = 'tx') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function todayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

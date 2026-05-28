import { CATEGORIES } from './config.js';
import {
  getCategorySpentThisMonth,
  getCurrentYearMonth,
  getMonthlyExpenseTotal,
} from './transactions.js';

export function getCategoryBudgetStatus(transactions, categoryBudgets) {
  return CATEGORIES.map((category) => {
    const limit = Number(categoryBudgets[category]) || 0;
    const spent = getCategorySpentThisMonth(transactions, category);
    const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    const exceeded = limit > 0 && spent > limit;

    return { category, limit, spent, percent, exceeded };
  });
}

export function getOverallBudgetStatus(transactions, monthlyLimit) {
  const spent = getMonthlyExpenseTotal(transactions, getCurrentYearMonth());
  const limit = Number(monthlyLimit) || 0;
  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

  return {
    limit,
    spent,
    percent,
    exceeded: limit > 0 && spent > limit,
  };
}

import { ensureAppData, getTransactions, initPage } from '../app.js';
import { formatCurrency } from '../config.js';
import { renderBarChart, renderDoughnutChart, renderLineChart } from '../chart.js';
import {
  calculateTotals,
  getCurrentYearMonth,
  getExpensesByCategory,
  getHighestSpendingCategory,
  getMonthlyTrend,
  getWeeklyExpenseTrend,
} from '../transactions.js';

const page = initPage({ pageId: 'analytics', title: 'Analytics' });
if (!page) throw new Error('Auth required');

function buildInsights(transactions, totals, top) {
  const container = document.getElementById('insights-list');
  const savings = totals.income - totals.expense;
  const rate = totals.income > 0 ? Math.round((savings / totals.income) * 100) : 0;

  const insights = [];

  if (top.category) {
    insights.push({
      title: `Highest spend: ${top.category}`,
      text: `You spent ${formatCurrency(top.amount)} on ${top.category} this month.`,
    });
  }

  if (savings >= 0) {
    insights.push({
      title: 'Positive balance',
      text: `Income exceeds expenses by ${formatCurrency(savings)} overall.`,
    });
  } else {
    insights.push({
      title: 'Spending more than income',
      text: `You're ${formatCurrency(Math.abs(savings))} over your total income. Try trimming discretionary categories.`,
    });
  }

  insights.push({
    title: 'Tip',
    text:
      rate >= 20
        ? `You're saving about ${rate}% of income — nice work for a student budget.`
        : 'Try setting category limits on the Budget page to control weekly spending.',
  });

  container.innerHTML = insights
    .map(
      (i) => `
    <div class="insight-card">
      <strong>${i.title}</strong>
      <p>${i.text}</p>
    </div>
  `
    )
    .join('');
}

async function init() {
  await ensureAppData();
  const transactions = getTransactions();
  const ym = getCurrentYearMonth();
  const totals = calculateTotals(transactions);
  const top = getHighestSpendingCategory(transactions, ym);

  document.getElementById('top-category').textContent = top.category
    ? `${top.category} (${formatCurrency(top.amount)})`
    : '—';

  const savings = totals.income - totals.expense;
  const rate = totals.income > 0 ? Math.round((savings / totals.income) * 100) : 0;
  document.getElementById('savings-rate').textContent = `${rate}%`;

  const catTotals = getExpensesByCategory(transactions, ym);
  renderDoughnutChart(
    'pie-chart',
    Object.keys(catTotals),
    Object.values(catTotals),
    formatCurrency
  );

  const weekly = getWeeklyExpenseTrend(transactions);
  renderLineChart('weekly-chart', weekly.labels, weekly.values, 'Weekly', formatCurrency);

  const monthly = getMonthlyTrend(transactions);
  renderBarChart('monthly-chart', monthly.labels, monthly.values, 'Monthly', formatCurrency);

  buildInsights(transactions, totals, top);
}

init();

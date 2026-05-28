import {
  ensureAppData,
  getTransactions,
  initPage,
  persistTransactions,
} from '../app.js';
import { todayDateString } from '../config.js';
import { downloadTransactionsCsv } from '../csv.js';
import { renderEmptyState } from '../components/empty-state.js';
import {
  fillTransactionForm,
  getTransactionFormData,
  populateFilterCategories,
  resetTransactionForm,
  showFormErrors,
  updateCategoryOptionsForType,
  validateTransactionForm,
} from '../components/forms.js';
import { showSkeleton } from '../components/skeleton.js';
import { renderTransactionRows } from '../components/transaction-list.js';
import { showToast } from '../components/toast.js';
import {
  addTransaction,
  deleteTransaction,
  filterTransactions,
  sortTransactions,
  updateTransaction,
} from '../transactions.js';

const page = initPage({ pageId: 'transactions', title: 'Transactions' });
if (!page) throw new Error('Auth required');

const filters = { search: '', category: 'all', dateFrom: '', dateTo: '', sortBy: 'latest' };

function refreshList() {
  let list = getTransactions();
  list = filterTransactions(list, filters);
  list = sortTransactions(list, filters.sortBy);

  const listEl = document.getElementById('transaction-list');
  const emptyWrap = document.getElementById('tx-empty');

  if (getTransactions().length === 0) {
    listEl.innerHTML = '';
    emptyWrap.classList.remove('hidden');
    renderEmptyState(emptyWrap, {
      title: 'No transactions yet',
      message: 'Use the form above to add your first entry.',
      icon: '📋',
    });
    return;
  }

  emptyWrap.classList.add('hidden');
  renderTransactionRows(listEl, list, {
    onEdit: handleEdit,
    onDelete: handleDelete,
    emptyMessage: 'No matches for your filters.',
  });
}

async function handleDelete(id) {
  const tx = getTransactions().find((t) => t.id === id);
  if (!tx || !confirm(`Delete "${tx.description}"?`)) return;

  await persistTransactions(deleteTransaction(getTransactions(), id));
  showToast('Transaction deleted', 'info');
  refreshList();
}

function handleEdit(id) {
  const tx = getTransactions().find((t) => t.id === id);
  if (!tx) return;
  fillTransactionForm(tx);
  document.getElementById('submit-btn').textContent = 'Save Changes';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');
  document.getElementById('form-title').textContent = 'Edit transaction';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function init() {
  const skeleton = document.getElementById('list-skeleton');
  showSkeleton(skeleton, 5);

  await ensureAppData();
  skeleton.innerHTML = '';

  populateFilterCategories();
  resetTransactionForm(todayDateString());

  document.getElementById('transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = getTransactionFormData();
    const errors = validateTransactionForm(data);
    if (Object.keys(errors).length) {
      showFormErrors(errors);
      return;
    }

    const editId = document.getElementById('transaction-id').value;
    let updated = getTransactions();

    if (editId) {
      updated = updateTransaction(updated, editId, data);
      showToast('Transaction updated', 'success');
    } else {
      updated = addTransaction(updated, data);
      showToast('Transaction added', 'success');
    }

    await persistTransactions(updated);
    resetTransactionForm(todayDateString());
    document.getElementById('form-title').textContent = 'Add transaction';
    refreshList();
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    resetTransactionForm(todayDateString());
    document.getElementById('form-title').textContent = 'Add transaction';
  });

  document.getElementById('transaction-type').addEventListener('change', (e) => {
    updateCategoryOptionsForType(e.target.value);
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    filters.search = e.target.value;
    refreshList();
  });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    filters.category = e.target.value;
    refreshList();
  });

  document.getElementById('filter-from').addEventListener('change', (e) => {
    filters.dateFrom = e.target.value;
    refreshList();
  });

  document.getElementById('filter-to').addEventListener('change', (e) => {
    filters.dateTo = e.target.value;
    refreshList();
  });

  document.getElementById('sort-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value;
    refreshList();
  });

  document.getElementById('export-csv-btn').addEventListener('click', () => {
    downloadTransactionsCsv(getTransactions());
    showToast('CSV downloaded', 'success');
  });

  refreshList();
}

init();

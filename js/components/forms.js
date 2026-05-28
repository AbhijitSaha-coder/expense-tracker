import { ALL_CATEGORIES, CATEGORIES, INCOME_CATEGORY } from '../config.js';

export function validateTransactionForm(data) {
  const errors = {};
  if (!data.description?.trim()) errors.description = 'Description is required.';
  const amount = Number(data.amount);
  if (!data.amount || amount <= 0) errors.amount = 'Enter a valid amount.';
  if (!data.date) errors.date = 'Pick a date.';
  return errors;
}

export function updateCategoryOptionsForType(type, selectId = 'transaction-category') {
  const select = document.getElementById(selectId);
  if (!select) return;
  const current = select.value;
  const list = type === 'income' ? [INCOME_CATEGORY, 'Other'] : CATEGORIES;

  select.innerHTML = '';
  for (const cat of list) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  }
  if (list.includes(current)) select.value = current;
}

export function populateFilterCategories(selectId = 'filter-category') {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="all">All categories</option>';
  for (const cat of ALL_CATEGORIES) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  }
}

export function showFormErrors(errors) {
  ['description', 'amount', 'date'].forEach((field) => {
    const el = document.getElementById(`error-${field}`);
    if (el) el.textContent = errors[field] || '';
  });
}

export function getTransactionFormData() {
  return {
    type: document.getElementById('transaction-type')?.value,
    description: document.getElementById('transaction-description')?.value,
    amount: document.getElementById('transaction-amount')?.value,
    category: document.getElementById('transaction-category')?.value,
    date: document.getElementById('transaction-date')?.value,
  };
}

export function fillTransactionForm(tx) {
  document.getElementById('transaction-id').value = tx.id;
  document.getElementById('transaction-type').value = tx.type;
  document.getElementById('transaction-description').value = tx.description;
  document.getElementById('transaction-amount').value = tx.amount;
  document.getElementById('transaction-date').value = tx.date;
  updateCategoryOptionsForType(tx.type);
  document.getElementById('transaction-category').value = tx.category;
}

export function resetTransactionForm(defaultDate) {
  const form = document.getElementById('transaction-form');
  form?.reset();
  const idField = document.getElementById('transaction-id');
  if (idField) idField.value = '';
  const dateField = document.getElementById('transaction-date');
  if (dateField) dateField.value = defaultDate;
  showFormErrors({});
  updateCategoryOptionsForType('expense');
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.textContent = 'Add Transaction';
  document.getElementById('cancel-edit-btn')?.classList.add('hidden');
}

import { escapeHtml, formatCurrency, formatDisplayDate } from '../config.js';

export function renderTransactionRows(listEl, transactions, { onEdit, onDelete, emptyMessage }) {
  if (!listEl) return;

  listEl.innerHTML = '';

  if (transactions.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-empty-msg';
    li.textContent = emptyMessage || 'No transactions found.';
    listEl.appendChild(li);
    return;
  }

  for (const tx of transactions) {
    const li = document.createElement('li');
    li.className = 'tx-row';
    const amountClass = tx.type === 'income' ? 'tx-row__amount--income' : 'tx-row__amount--expense';
    const prefix = tx.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <div class="tx-row__main">
        <strong>${escapeHtml(tx.description)}</strong>
        <span class="tx-row__meta">${tx.category} · ${formatDisplayDate(tx.date)} · ${tx.type}</span>
      </div>
      <span class="tx-row__amount ${amountClass}">${prefix}${formatCurrency(tx.amount)}</span>
      <div class="tx-row__actions">
        <button type="button" class="btn btn--small btn--edit" data-edit>Edit</button>
        <button type="button" class="btn btn--small btn--danger" data-delete>Delete</button>
      </div>
    `;

    li.querySelector('[data-edit]').addEventListener('click', () => onEdit(tx.id));
    li.querySelector('[data-delete]').addEventListener('click', () => onDelete(tx.id));
    listEl.appendChild(li);
  }
}

export function renderRecentList(listEl, transactions) {
  if (!listEl) return;
  listEl.innerHTML = '';

  if (transactions.length === 0) {
    listEl.innerHTML = '<li class="list-empty-msg">No recent activity.</li>';
    return;
  }

  for (const tx of transactions) {
    const li = document.createElement('li');
    li.className = 'recent-item';
    const sign = tx.type === 'income' ? '+' : '-';
    const cls = tx.type === 'income' ? 'recent-item__amt--in' : 'recent-item__amt--out';
    li.innerHTML = `
      <span>${escapeHtml(tx.description)}</span>
      <span class="${cls}">${sign}${formatCurrency(tx.amount)}</span>
    `;
    listEl.appendChild(li);
  }
}

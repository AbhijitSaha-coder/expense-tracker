export function renderEmptyState(container, { title, message, icon = '📭' }) {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">${icon}</span>
      <p class="empty-state__title">${title}</p>
      <p class="empty-state__text">${message}</p>
    </div>
  `;
}

export function showSkeleton(container, rows = 4) {
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('is-loading');

  for (let i = 0; i < rows; i++) {
    const block = document.createElement('div');
    block.className = 'skeleton skeleton--row';
    container.appendChild(block);
  }
}

export function hideSkeleton(container) {
  if (!container) return;
  container.classList.remove('is-loading');
  container.innerHTML = '';
}

export function renderCardSkeletons(container, count = 3) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton skeleton--card';
    container.appendChild(card);
  }
}

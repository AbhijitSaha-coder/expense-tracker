import { NAV_ITEMS } from '../config.js';
import { getDisplayName, logout } from '../auth.js';
import { loadTheme, saveTheme } from '../storage.js';

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
  setTheme(loadTheme());
}

export function injectLayout(activePageId) {
  const shell = document.getElementById('app-shell');
  if (!shell) return;

  const navLinks = NAV_ITEMS.map(
    (item) => `
      <a href="${item.href}" class="sidebar__link ${item.id === activePageId ? 'sidebar__link--active' : ''}"
         data-page="${item.id}">
        <span class="sidebar__icon" aria-hidden="true">${item.icon}</span>
        ${item.label}
      </a>
    `
  ).join('');

  shell.innerHTML = `
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
      <div class="sidebar__brand">
        <span class="sidebar__logo">₹</span>
        <div>
          <strong>SpendWise</strong>
          <small>Finance tracker</small>
        </div>
      </div>
      <nav class="sidebar__nav">${navLinks}</nav>
      <button type="button" class="sidebar__logout" id="logout-btn">Log out</button>
    </aside>
    <div class="main-wrap">
      <header class="topbar">
        <button type="button" class="topbar__menu" id="menu-toggle" aria-label="Open menu">☰</button>
        <h1 class="topbar__title" id="page-title"></h1>
        <div class="topbar__user">
          <span class="topbar__avatar" aria-hidden="true">${getDisplayName().charAt(0).toUpperCase()}</span>
          <span class="topbar__name">${getDisplayName()}</span>
        </div>
      </header>
      <div class="page-body" id="page-body"></div>
    </div>
  `;

  document.getElementById('menu-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
  });

  // Move existing page content into page-body
  const content = document.getElementById('page-content');
  const body = document.getElementById('page-body');
  if (content && body) {
    while (content.firstChild) body.appendChild(content.firstChild);
    content.remove();
  }
}

export function setPageTitle(title) {
  const el = document.getElementById('page-title');
  if (el) el.textContent = title;
  document.title = `${title} — SpendWise`;
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('sidebar--open');
  document.getElementById('sidebar-overlay')?.classList.toggle('sidebar-overlay--visible');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('sidebar--open');
  document.getElementById('sidebar-overlay')?.classList.remove('sidebar-overlay--visible');
}

export function bindThemeToggle(buttonId = 'theme-toggle') {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
    saveTheme(next);
  });
}

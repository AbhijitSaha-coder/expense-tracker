import { ensureAppData, initPage } from '../app.js';
import { CURRENCIES } from '../config.js';
import { bindThemeToggle, initTheme } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { getDisplayName } from '../auth.js';
import {
  loadCurrency,
  loadUser,
  resetAllData,
  saveCurrency,
  saveUser,
} from '../storage.js';

const page = initPage({ pageId: 'settings', title: 'Settings' });
if (!page) throw new Error('Auth required');

function renderProfile() {
  const user = loadUser();
  document.getElementById('profile-name').value = user.name || '';
  document.getElementById('profile-email').value = user.email || '';
  document.getElementById('profile-name-display').textContent = user.name || 'User';
  document.getElementById('profile-email-display').textContent = user.email || '';
  document.getElementById('profile-avatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
}

async function init() {
  initTheme();
  await ensureAppData();
  renderProfile();

  document.getElementById('currency-select').value = loadCurrency();

  bindThemeToggle('theme-toggle');

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveUser({
      name: document.getElementById('profile-name').value.trim(),
      email: document.getElementById('profile-email').value.trim(),
    });
    renderProfile();
    showToast('Profile saved', 'success');
  });

  document.getElementById('currency-select').addEventListener('change', (e) => {
    const code = e.target.value;
    if (!CURRENCIES[code]) return;
    saveCurrency(code);
    showToast(`Currency set to ${code}`, 'info');
    setTimeout(() => window.location.reload(), 400);
  });

  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (!confirm('Delete ALL app data? This cannot be undone.')) return;
    resetAllData();
    showToast('Data reset. Reloading…', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
  });
}

init();

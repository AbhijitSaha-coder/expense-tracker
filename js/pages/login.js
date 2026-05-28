import { initTheme } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { isLoggedIn, handleLogin } from '../auth.js';
import { fetchUserProfile } from '../api.js';
import { loadUser, saveUser } from '../storage.js';

initTheme();

if (isLoggedIn()) {
  window.location.href = 'dashboard.html';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    await handleLogin(email, password);
    const profile = await fetchUserProfile();
    const existing = loadUser();
    saveUser({
      ...existing,
      name: profile.name,
      email: profile.email || email,
    });
    showToast('Welcome back!', 'success');
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorEl.textContent = err.message || 'Login failed';
    showToast('Could not sign in', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign in';
  }
});

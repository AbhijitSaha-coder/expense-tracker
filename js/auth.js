import { loginUser } from './api.js';
import { loadAuth, loadUser, saveAuth, saveUser } from './storage.js';

export function isLoggedIn() {
  return loadAuth().loggedIn === true;
}

export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

export function logout() {
  saveAuth({ loggedIn: false });
  window.location.href = 'login.html';
}

export async function handleLogin(email, password) {
  const result = await loginUser(email, password);
  const user = loadUser();
  saveUser({ ...user, email: result.email });
  saveAuth({ loggedIn: true, email: result.email });
  return result;
}

export function getDisplayName() {
  const user = loadUser();
  return user.name || user.email || 'User';
}

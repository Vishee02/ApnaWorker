/* ===== DARKMODE.JS ===== */
'use strict';

function initDarkMode() {
  const saved = localStorage.getItem('apnaworker_theme') || 'dark';
  applyTheme(saved);

  const btn  = document.getElementById('darkModeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('apnaworker_theme', next);
  });
}

function applyTheme(theme) {
  const icon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    if (icon) { icon.className = 'fa-solid fa-moon'; }
  } else {
    document.body.classList.remove('dark-mode');
    if (icon) { icon.className = 'fa-solid fa-sun'; }
  }
}

document.addEventListener('DOMContentLoaded', initDarkMode);
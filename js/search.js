/* ===== SEARCH.JS ===== */
'use strict';

function searchWorkers() {
  const skill    = (document.getElementById('searchSkill')?.value    || '').toLowerCase().trim();
  const location = (document.getElementById('searchLocation')?.value || '').toLowerCase().trim();

  if (!skill && !location) {
    showToast('Please enter a skill or location to search', 'warning');
    return;
  }

  sessionStorage.setItem('searchSkill',    skill);
  sessionStorage.setItem('searchLocation', location);
  window.location.href = 'freelancer.html';
}

// Auto-suggest dropdown
function initSearchSuggest() {
  const skillInput = document.getElementById('searchSkill');
  if (!skillInput) return;

  const suggestions = ['Electrician','Plumber','Painter','Developer','Designer','Carpenter','Mechanic','Cleaner','Driver','Tutor','Photographer','Chef'];

  let box;

  skillInput.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    removeSuggestBox();
    if (!val) return;

    const matches = suggestions.filter(s => s.toLowerCase().includes(val));
    if (!matches.length) return;

    box = document.createElement('div');
    box.className = 'suggest-box glass-card';
    box.style.cssText = `position:absolute;top:100%;left:0;right:0;z-index:200;border-radius:12px;overflow:hidden;margin-top:4px;`;
    matches.slice(0,5).forEach(m => {
      const item = document.createElement('div');
      item.className = 'suggest-item';
      item.style.cssText = `padding:10px 16px;cursor:pointer;font-size:0.875rem;color:var(--text-muted);transition:background 0.2s;`;
      item.innerHTML = `<i class="fa-solid fa-magnifying-glass" style="margin-right:8px;color:var(--primary-light);"></i>${m}`;
      item.addEventListener('mouseenter', () => item.style.background='rgba(37,99,235,0.1)');
      item.addEventListener('mouseleave', () => item.style.background='');
      item.addEventListener('click', () => { skillInput.value = m; removeSuggestBox(); });
      box.appendChild(item);
    });

    const wrap = skillInput.closest('.search-field') || skillInput.parentElement;
    wrap.style.position = 'relative';
    wrap.appendChild(box);
  });

  document.addEventListener('click', e => {
    if (!skillInput.contains(e.target)) removeSuggestBox();
  });

  function removeSuggestBox() { if (box && box.parentElement) { box.parentElement.removeChild(box); box = null; } }
}

// Apply search params on freelancer page
function applySearchParams() {
  const skill    = sessionStorage.getItem('searchSkill')    || '';
  const location = sessionStorage.getItem('searchLocation') || '';
  if (!skill && !location) return;

  const inp = document.getElementById('sidebarSearch');
  if (inp) {
    inp.value = skill || location;
    setTimeout(() => { if (typeof applyFilters === 'function') applyFilters(); }, 100);
  }

  sessionStorage.removeItem('searchSkill');
  sessionStorage.removeItem('searchLocation');
}

// Toast notification
function showToast(message, type = 'info') {
  const existing = document.querySelectorAll('.toast-notification');
  existing.forEach(t => t.remove());

  const colors = { info:'#2563eb', success:'#10b981', warning:'#f59e0b', error:'#ef4444' };
  const icons  = { info:'fa-info-circle', success:'fa-check-circle', warning:'fa-exclamation-triangle', error:'fa-times-circle' };

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:var(--card-bg);border:1px solid ${colors[type]}44;
    backdrop-filter:blur(20px);border-radius:12px;
    padding:14px 20px;display:flex;align-items:center;gap:12px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    animation:slideInRight 0.3s ease;max-width:340px;
    font-family:'Poppins',sans-serif;font-size:0.875rem;color:var(--text);
  `;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]}" style="color:${colors[type]};font-size:1.1rem;flex-shrink:0;"></i>
    <span>${message}</span>
  `;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
  initSearchSuggest();
  applySearchParams();

  // Enter key on search bar
  document.getElementById('searchSkill')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWorkers();
  });
  document.getElementById('searchLocation')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWorkers();
  });
});
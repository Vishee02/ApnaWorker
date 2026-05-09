/* ===== BOOKING.JS ===== */
'use strict';

let currentStep     = 1;
let selectedService = null;
let selectedTime    = null;

const SERVICES = [
  { id:'electrician', name:'Electrician', icon:'fa-bolt',       base:500 },
  { id:'plumber',     name:'Plumber',     icon:'fa-faucet',     base:400 },
  { id:'painter',     name:'Painter',     icon:'fa-paint-roller',base:350 },
  { id:'developer',   name:'Developer',   icon:'fa-code',        base:1500 },
  { id:'designer',    name:'Designer',    icon:'fa-pen-ruler',   base:1200 },
  { id:'carpenter',   name:'Carpenter',   icon:'fa-screwdriver', base:600 },
];

// ── RENDER SERVICE OPTIONS ────────────────────────────────────────────────────
function renderServiceOptions() {
  const container = document.getElementById('serviceOptions');
  if (!container) return;
  container.innerHTML = SERVICES.map(s => `
    <div class="service-option-btn" data-id="${s.id}" data-base="${s.base}" onclick="selectService(this, '${s.id}', ${s.base})">
      <i class="fa-solid ${s.icon}"></i>
      <span>${s.name}</span>
    </div>
  `).join('');
}

function selectService(el, id, base) {
  document.querySelectorAll('.service-option-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedService = { id, base };
  updatePrice(base);
}

// ── STEPS ─────────────────────────────────────────────────────────────────────
function nextStep(step) {
  // Validation per step
  if (currentStep === 1 && step === 2) {
    if (!selectedService) { showToast('Please select a service type', 'warning'); return; }
  }
  if (currentStep === 2 && step === 3) {
    const date = document.getElementById('bookingDate')?.value;
    if (!date) { showToast('Please select a date', 'warning'); return; }
    if (!selectedTime) { showToast('Please select a time slot', 'warning'); return; }
  }
  if (currentStep === 3 && step === 4) {
    const name  = document.getElementById('clientName')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    if (!name || !phone) { showToast('Please fill in your name and phone', 'warning'); return; }
    buildBookingSummary();
  }

  // Hide current, show next
  document.querySelectorAll('.booking-step-panel').forEach(p => p.classList.remove('active'));
  const nextPanel = document.getElementById(`bookingStep${step}`);
  if (nextPanel) nextPanel.classList.add('active');

  // Update indicators
  document.querySelectorAll('.booking-step').forEach((s, i) => {
    const n = i + 1;
    s.classList.remove('active', 'done');
    if (n < step) s.classList.add('done');
    if (n === step) s.classList.add('active');
  });

  currentStep = step;
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function selectTimeSlot(el) {
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  selectedTime = el.textContent.trim();
}

// ── PRICE ─────────────────────────────────────────────────────────────────────
function updatePrice(base) {
  const platform = Math.round(base * 0.05);
  const total    = base + platform;
  if (document.getElementById('priceService'))  document.getElementById('priceService').textContent  = `₹${base}`;
  if (document.getElementById('pricePlatform')) document.getElementById('pricePlatform').textContent = `₹${platform}`;
  if (document.getElementById('priceTotal'))    document.getElementById('priceTotal').textContent    = `₹${total}`;
}

// ── SELECTED WORKER FROM SESSION ──────────────────────────────────────────────
function loadSelectedWorker() {
  const workerJson = sessionStorage.getItem('selectedWorker');
  if (!workerJson) return;
  try {
    const w = JSON.parse(workerJson);
    const nameEl  = document.getElementById('miniWorkerName');
    const skillEl = document.getElementById('miniWorkerSkill');
    const avEl    = document.getElementById('miniAvatar');
    if (nameEl)  nameEl.textContent  = w.name;
    if (skillEl) skillEl.textContent = w.skill;
    if (avEl) {
      avEl.textContent = w.avatar || w.name[0];
      avEl.style.background = `linear-gradient(135deg,${w.color || '#2563eb'},${w.color || '#06b6d4'}99)`;
    }
    if (w.price) updatePrice(w.price);
    // Pre-select matching service
    const match = document.querySelector(`.service-option-btn[data-id="${w.category}"]`);
    if (match) selectService(match, w.category, w.price);
  } catch(err) { console.warn('Worker parse error', err); }
}

// ── SUMMARY ───────────────────────────────────────────────────────────────────
function buildBookingSummary() {
  const summary = document.getElementById('bookingSummary');
  if (!summary) return;

  const service  = selectedService?.id || 'Not selected';
  const date     = document.getElementById('bookingDate')?.value || 'Not selected';
  const time     = selectedTime || 'Not selected';
  const location = document.getElementById('bookingLocation')?.value || 'Not provided';
  const name     = document.getElementById('clientName')?.value || '';
  const phone    = document.getElementById('clientPhone')?.value || '';
  const base     = selectedService?.base || 0;
  const platform = Math.round(base * 0.05);

  summary.innerHTML = `
    <div class="summary-row"><span class="summary-label">Service</span><span class="summary-value" style="text-transform:capitalize;">${service}</span></div>
    <div class="summary-row"><span class="summary-label">Date</span><span class="summary-value">${date}</span></div>
    <div class="summary-row"><span class="summary-label">Time</span><span class="summary-value">${time}</span></div>
    <div class="summary-row"><span class="summary-label">Location</span><span class="summary-value">${location}</span></div>
    <div class="summary-row"><span class="summary-label">Name</span><span class="summary-value">${name}</span></div>
    <div class="summary-row"><span class="summary-label">Phone</span><span class="summary-value">${phone}</span></div>
    <div class="summary-row"><span class="summary-label">Service Fee</span><span class="summary-value">₹${base}</span></div>
    <div class="summary-row"><span class="summary-label">Platform Fee (5%)</span><span class="summary-value">₹${platform}</span></div>
    <div class="summary-row" style="font-weight:700;font-size:1rem;"><span class="summary-label">Total</span><span class="summary-value gradient-text">₹${base + platform}</span></div>
  `;
}

// ── CONFIRM BOOKING ───────────────────────────────────────────────────────────
function confirmBooking() {
  const bookingId = 'BK' + Date.now().toString(36).toUpperCase();
  document.getElementById('bookingIdDisplay').textContent = bookingId;

  // Save to localStorage
  const booking = {
    id: bookingId,
    service: selectedService?.id,
    date: document.getElementById('bookingDate')?.value,
    time: selectedTime,
    location: document.getElementById('bookingLocation')?.value,
    name: document.getElementById('clientName')?.value,
    phone: document.getElementById('clientPhone')?.value,
    amount: (selectedService?.base || 0) + Math.round((selectedService?.base || 0) * 0.05),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const existing = JSON.parse(localStorage.getItem('apnaworker_bookings') || '[]');
  existing.push(booking);
  localStorage.setItem('apnaworker_bookings', JSON.stringify(existing));
  sessionStorage.removeItem('selectedWorker');

  // Show success modal
  const modal = document.getElementById('successModal');
  if (modal) modal.style.display = 'flex';
}

// ── DATE PICKER MIN ───────────────────────────────────────────────────────────
function setMinDate() {
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderServiceOptions();
  loadSelectedWorker();
  setMinDate();

  // Keyboard shortcut to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('successModal');
      if (modal) modal.style.display = 'none';
    }
  });
});
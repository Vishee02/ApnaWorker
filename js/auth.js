/* ===== AUTH.JS ===== */
'use strict';

// Three.js auth background canvas
function initAuthCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Floating geometric wireframes
  const objects = [];
  const mat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.07 });
  const geos = [
    new THREE.IcosahedronGeometry(6),
    new THREE.OctahedronGeometry(4),
    new THREE.TorusGeometry(5, 1.5, 8, 20),
    new THREE.TetrahedronGeometry(4),
  ];
  geos.forEach((g, i) => {
    const mesh = new THREE.Mesh(g, mat.clone());
    mesh.position.set((i % 2 === 0 ? -1 : 1) * (Math.random() * 12 + 6), (Math.random() - 0.5) * 12, -15);
    mesh.material.opacity = 0.04 + Math.random() * 0.06;
    scene.add(mesh);
    objects.push(mesh);
  });

  // Particle field
  const pCount = 800;
  const pGeo   = new THREE.BufferGeometry();
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 50;
    pPos[i*3+1] = (Math.random() - 0.5) * 50;
    pPos[i*3+2] = (Math.random() - 0.5) * 30;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.12, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(pGeo, pMat));

  camera.position.z = 20;

  let frame = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    frame++;
    objects.forEach((o, i) => {
      o.rotation.x += 0.003 + i * 0.001;
      o.rotation.y += 0.004 + i * 0.001;
      o.position.y = Math.sin(frame * 0.008 + i * 1.5) * 3;
    });
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ── LOGIN ────────────────────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  clearErrors();

  const email    = document.getElementById('loginEmail')?.value.trim()    || '';
  const password = document.getElementById('loginPassword')?.value         || '';
  let valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('emailError', 'Please enter a valid email address');
    valid = false;
  }
  if (!password || password.length < 6) {
    showFieldError('passwordError', 'Password must be at least 6 characters');
    valid = false;
  }
  if (!valid) return;

  const btn     = document.getElementById('loginBtn');
  const btnText = document.getElementById('loginBtnText');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; }
  if (btnText) btnText.textContent = 'Signing in...';

  // Simulate API call (replace with real fetch to backend)
  setTimeout(() => {
    // Demo credentials
    if (email === 'admin@apnaworker.com' && password === 'admin123') {
      localStorage.setItem('apnaworker_user', JSON.stringify({ name:'Admin', role:'admin', email }));
      window.location.href = 'dashboard.html';
      return;
    }
    if (email && password.length >= 6) {
      localStorage.setItem('apnaworker_user', JSON.stringify({ name: email.split('@')[0], role:'client', email }));
      window.location.href = 'dashboard.html';
      return;
    }
    showFieldError('passwordError', 'Invalid credentials. Try admin@apnaworker.com / admin123');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    if (btnText) btnText.textContent = 'Sign In';
  }, 1200);
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName  = document.getElementById('lastName')?.value.trim()  || '';
  const email     = document.getElementById('regEmail')?.value.trim()  || '';
  const phone     = document.getElementById('phone')?.value.trim()     || '';
  const password  = document.getElementById('regPassword')?.value       || '';
  const role      = document.querySelector('.role-option.active')?.dataset.role || 'client';

  if (!firstName || !lastName || !email || !phone || !password) {
    if (typeof showToast === 'function') showToast('Please fill in all required fields', 'error');
    return;
  }
  if (password.length < 8) {
    if (typeof showToast === 'function') showToast('Password must be at least 8 characters', 'error');
    return;
  }

  const userData = { name:`${firstName} ${lastName}`, email, phone, role };
  localStorage.setItem('apnaworker_user', JSON.stringify(userData));

  if (typeof showToast === 'function') showToast('Account created successfully! Redirecting...', 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
}

// ── ROLE SELECTOR ─────────────────────────────────────────────────────────────
function selectRole(role, el) {
  document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const skillGroup = document.getElementById('skillGroup');
  if (skillGroup) skillGroup.style.display = role === 'freelancer' ? 'block' : 'none';
}

// ── TOGGLE PASSWORD ───────────────────────────────────────────────────────────
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  const icon = btn.querySelector('i');
  if (icon) { icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'; }
}

// ── PASSWORD STRENGTH ─────────────────────────────────────────────────────────
function initPasswordStrength() {
  const passwordInput = document.getElementById('regPassword');
  if (!passwordInput) return;

  passwordInput.addEventListener('input', function() {
    const val = this.value;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    if (!fill || !text) return;

    let strength = 0;
    if (val.length >= 8)                            strength++;
    if (/[A-Z]/.test(val))                          strength++;
    if (/[0-9]/.test(val))                          strength++;
    if (/[^A-Za-z0-9]/.test(val))                  strength++;

    const levels = [
      { pct:'0%',   color:'#ef4444', label:'Too short' },
      { pct:'25%',  color:'#ef4444', label:'Weak' },
      { pct:'50%',  color:'#f59e0b', label:'Fair' },
      { pct:'75%',  color:'#3b82f6', label:'Good' },
      { pct:'100%', color:'#10b981', label:'Strong' },
    ];
    const lvl = levels[strength] || levels[0];
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    text.textContent = lvl.label;
    text.style.color = lvl.color;
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPasswordStrength();

  // Animated input focus effects
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
      this.closest('.input-wrapper')?.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.closest('.input-wrapper')?.classList.remove('focused');
    });
  });
});
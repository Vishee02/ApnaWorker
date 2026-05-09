/* ===== APNAWORKER — MAIN APP.JS ===== */
'use strict';

// ── DATA ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { icon: '⚡', name: 'Electrician',  count: '2.4K', filter: 'electrician', color: '#f59e0b' },
  { icon: '🔧', name: 'Plumber',      count: '1.8K', filter: 'plumber',     color: '#06b6d4' },
  { icon: '🎨', name: 'Painter',      count: '1.2K', filter: 'painter',     color: '#8b5cf6' },
  { icon: '💻', name: 'Developer',    count: '3.1K', filter: 'developer',   color: '#2563eb' },
  { icon: '🖌️', name: 'Designer',     count: '980',  filter: 'designer',    color: '#ec4899' },
  { icon: '🪚', name: 'Carpenter',    count: '760',  filter: 'carpenter',   color: '#84cc16' },
  { icon: '🔩', name: 'Mechanic',     count: '1.1K', filter: 'mechanic',    color: '#f97316' },
  { icon: '🧹', name: 'Cleaner',      count: '2.0K', filter: 'cleaner',     color: '#14b8a6' },
];

const WORKERS = [
  { id:1,  name:'Rajesh Kumar',    skill:'Electrician', location:'Varanasi, UP',   rating:4.9, reviews:142, price:500,  jobs:210, avatar:'RK', color:'#2563eb', tags:['Wiring','Repair','Fan Install'], verified:true,  category:'electrician', bio:'10+ years of experience in residential and commercial electrical work.' },
  { id:2,  name:'Suresh Patel',    skill:'Plumber',     location:'Lucknow, UP',    rating:4.7, reviews:98,  price:400,  jobs:160, avatar:'SP', color:'#06b6d4', tags:['Leak Fix','Pipe Lay','Sanit.'],  verified:true,  category:'plumber',     bio:'Specializing in emergency plumbing and bathroom renovations.' },
  { id:3,  name:'Priya Sharma',    skill:'Developer',   location:'Noida, UP',      rating:4.9, reviews:87,  price:1500, jobs:95,  avatar:'PS', color:'#8b5cf6', tags:['React','Node.js','MongoDB'],      verified:true,  category:'developer',   bio:'Full-stack developer with 6 years experience building scalable apps.' },
  { id:4,  name:'Vikram Singh',    skill:'Painter',     location:'Agra, UP',       rating:4.6, reviews:73,  price:350,  jobs:130, avatar:'VS', color:'#ec4899', tags:['Interior','Exterior','Polish'],   verified:true,  category:'painter',     bio:'Creative painter specializing in texture and decorative finishes.' },
  { id:5,  name:'Amit Joshi',      skill:'Carpenter',   location:'Kanpur, UP',     rating:4.8, reviews:115, price:600,  jobs:180, avatar:'AJ', color:'#84cc16', tags:['Furniture','Cabinets','Door'],    verified:true,  category:'carpenter',   bio:'Custom furniture maker and home woodwork expert.' },
  { id:6,  name:'Neha Gupta',      skill:'Designer',    location:'Delhi, NCR',     rating:5.0, reviews:62,  price:1200, jobs:78,  avatar:'NG', color:'#f97316', tags:['UI/UX','Figma','Branding'],       verified:true,  category:'designer',    bio:'Award-winning UX designer who has worked with top startups.' },
  { id:7,  name:'Rohit Yadav',     skill:'Electrician', location:'Prayagraj, UP',  rating:4.5, reviews:89,  price:450,  jobs:145, avatar:'RY', color:'#2563eb', tags:['Solar','Inverter','Wiring'],      verified:false, category:'electrician', bio:'Certified solar panel installer and electrical maintenance expert.' },
  { id:8,  name:'Kavita Mishra',   skill:'Cleaner',     location:'Varanasi, UP',   rating:4.7, reviews:201, price:300,  jobs:420, avatar:'KM', color:'#14b8a6', tags:['Deep Clean','Sofa','Carpet'],     verified:true,  category:'cleaner',     bio:'Professional home and office cleaning specialist.' },
  { id:9,  name:'Dev Agarwal',     skill:'Developer',   location:'Gurugram, HR',   rating:4.8, reviews:55,  price:2000, jobs:62,  avatar:'DA', color:'#8b5cf6', tags:['Python','AI/ML','FastAPI'],       verified:true,  category:'developer',   bio:'AI/ML engineer building intelligent software solutions.' },
  { id:10, name:'Seema Verma',     skill:'Designer',    location:'Mumbai, MH',     rating:4.9, reviews:134, price:1800, jobs:110, avatar:'SV', color:'#ec4899', tags:['Motion','Brand','Print'],         verified:true,  category:'designer',    bio:'Motion designer & brand identity creator for global clients.' },
  { id:11, name:'Manoj Tiwari',    skill:'Plumber',     location:'Varanasi, UP',   rating:4.4, reviews:67,  price:380,  jobs:112, avatar:'MT', color:'#06b6d4', tags:['Drainage','RO Service','Tank'],   verified:false, category:'plumber',     bio:'Specializing in RO water purifier installation and drainage issues.' },
  { id:12, name:'Ankit Dubey',     skill:'Mechanic',    location:'Allahabad, UP',  rating:4.6, reviews:93,  price:550,  jobs:157, avatar:'AD', color:'#f97316', tags:['Bike','Car AC','Engine'],         verified:true,  category:'mechanic',    bio:'Two-wheeler and four-wheeler mechanic with a well-equipped workshop.' },
];

const TESTIMONIALS = [
  { name:'Aman Srivastava', role:'Home Owner, Varanasi', text:'Found an excellent electrician within 10 minutes. Rajesh did an outstanding job fixing my entire home wiring. Absolutely recommended!', rating:5, avatar:'AS', color:'#2563eb' },
  { name:'Riya Kapoor',     role:'Startup Founder, Noida', text:'Priya built our entire website from scratch. Professional, timely, and the quality exceeded our expectations. Will hire again!', rating:5, avatar:'RK', color:'#8b5cf6' },
  { name:'Sudhir Pandey',   role:'Business Owner, Lucknow', text:'Booked a plumber for an emergency at midnight. Suresh arrived in 30 minutes. ApnaWorker is a lifesaver!', rating:5, avatar:'SP', color:'#06b6d4' },
  { name:'Pooja Mehta',     role:'Homemaker, Agra', text:'Vikram painted our entire 3BHK in just 4 days. Beautiful finish and very reasonable price. 10/10!', rating:4, avatar:'PM', color:'#ec4899' },
  { name:'Karan Bajaj',     role:'IT Professional, Gurugram', text:'Neha designed our entire product UI from scratch. Creative, responsive, and very easy to work with!', rating:5, avatar:'KB', color:'#f97316' },
  { name:'Sunita Devi',     role:'Teacher, Varanasi', text:'Kavita does the most thorough cleaning job I have ever seen. My house sparkles every time. Regular customer now!', rating:5, avatar:'SD', color:'#14b8a6' },
];

// ── THREE.JS HERO CANVAS ─────────────────────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 1500;
  const geo  = new THREE.BufferGeometry();
  const pos  = new Float32Array(particleCount * 3);
  const cols = new Float32Array(particleCount * 3);

  const palette = [
    [37/255, 99/255, 235/255],
    [6/255, 182/255, 212/255],
    [139/255, 92/255, 246/255],
    [1, 1, 1],
  ];

  for (let i = 0; i < particleCount; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 60;
    pos[i*3+1] = (Math.random() - 0.5) * 60;
    pos[i*3+2] = (Math.random() - 0.5) * 40;
    const c = palette[Math.floor(Math.random() * palette.length)];
    cols[i*3] = c[0]; cols[i*3+1] = c[1]; cols[i*3+2] = c[2];
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating geometric shapes
  const shapes = [];
  const shapeMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.08 });
  [[8,3,3],[12,1],[6,4]], [
    new THREE.IcosahedronGeometry(3),
    new THREE.OctahedronGeometry(2),
    new THREE.TetrahedronGeometry(2.5),
  ].forEach((geo, i) => {
    const mesh = new THREE.Mesh(geo, shapeMat.clone());
    mesh.position.set((i-1)*15, (Math.random()-0.5)*8, -10);
    mesh.material.opacity = 0.06 + Math.random()*0.06;
    scene.add(mesh);
    shapes.push(mesh);
  });

  camera.position.z = 20;

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let frame = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    frame++;
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    shapes.forEach((s, i) => {
      s.rotation.x += 0.003;
      s.rotation.y += 0.005;
      s.position.y = Math.sin(frame * 0.01 + i * 2) * 2;
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

// ── TYPED TEXT EFFECT ─────────────────────────────────────────────────────────
function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const words = ['Electricians','Plumbers','Developers','Designers','Painters','Carpenters'];
  let wi = 0, ci = 0, deleting = false;

  const type = () => {
    const word = words[wi % words.length];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length)     { deleting = true; setTimeout(type, 1500); return; }
    if (deleting && ci < 0)               { deleting = false; wi++; ci = 0; }
    setTimeout(type, deleting ? 60 : 90);
  };
  type();
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card reveal" onclick="filterAndGo('${cat.filter}')">
      <span class="category-icon">${cat.icon}</span>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.count} pros</div>
    </div>
  `).join('');
}

function filterAndGo(filter) {
  sessionStorage.setItem('workerFilter', filter);
  window.location.href = 'freelancer.html';
}

// ── WORKER CARDS ──────────────────────────────────────────────────────────────
function renderWorkerCards(containerId = 'workersGrid', workers = WORKERS.slice(0, 6)) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = workers.map(w => workerCardHTML(w)).join('');
  grid.querySelectorAll('.worker-card').forEach(card => {
    initTiltEffect(card);
  });
}

function workerCardHTML(w) {
  const stars = '★'.repeat(Math.floor(w.rating)) + (w.rating % 1 >= 0.5 ? '½' : '');
  return `
    <div class="worker-card reveal" data-category="${w.category}" onclick="openWorkerModal(${w.id})">
      <div class="worker-card-header">
        <div class="worker-avatar gradient-bg" style="background:linear-gradient(135deg,${w.color},${w.color}99);">
          ${w.avatar}
          ${w.verified ? '<span class="verified-badge"><i class="fa-solid fa-check"></i></span>' : ''}
        </div>
        <div class="worker-meta">
          <div class="worker-name">${w.name}</div>
          <span class="worker-skill">${w.skill}</span>
          <div class="worker-location"><i class="fa-solid fa-location-dot"></i>${w.location}</div>
        </div>
      </div>
      <div class="worker-card-body">
        <div class="worker-rating">
          <span class="stars">${stars}</span>
          <span class="rating-val">${w.rating}</span>
          <span class="rating-count">(${w.reviews})</span>
        </div>
        <div class="worker-tags">
          ${w.tags.map(t => `<span class="worker-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="worker-card-footer">
        <div class="worker-price">
          <span class="gradient-text">₹${w.price}</span><small>/hr</small>
          <div class="worker-jobs">${w.jobs}+ jobs done</div>
        </div>
        <button class="btn btn-primary" onclick="event.stopPropagation(); bookWorker(${w.id})">Book Now</button>
      </div>
    </div>
  `;
}

// ── 3D TILT EFFECT ────────────────────────────────────────────────────────────
function initTiltEffect(el) {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `translateY(-10px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}

// ── WORKER MODAL ──────────────────────────────────────────────────────────────
function openWorkerModal(id) {
  const w = WORKERS.find(x => x.id === id);
  if (!w) return;
  const modal  = document.getElementById('profileModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <button class="icon-btn" style="position:absolute;top:16px;right:16px;" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
    <div class="modal-profile-header">
      <div class="modal-avatar" style="background:linear-gradient(135deg,${w.color},${w.color}99);">${w.avatar}</div>
      <div>
        <div class="modal-name">${w.name}</div>
        <div class="modal-skill">${w.skill}</div>
        <div class="modal-location"><i class="fa-solid fa-location-dot"></i> ${w.location}</div>
        <div class="modal-badges">
          ${w.verified ? '<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> Verified</span>' : ''}
          <span class="badge" style="background:rgba(37,99,235,0.15);color:#93c5fd;">${w.jobs}+ jobs</span>
        </div>
      </div>
    </div>
    <div class="modal-stats">
      <div class="modal-stat-card"><span class="modal-stat-value gradient-text">${w.rating}★</span><span class="modal-stat-label">Rating</span></div>
      <div class="modal-stat-card"><span class="modal-stat-value gradient-text">${w.reviews}</span><span class="modal-stat-label">Reviews</span></div>
      <div class="modal-stat-card"><span class="modal-stat-value gradient-text">₹${w.price}/hr</span><span class="modal-stat-label">Rate</span></div>
    </div>
    <div class="modal-section-title">About</div>
    <p style="color:var(--text-muted);font-size:0.875rem;line-height:1.7;">${w.bio}</p>
    <div class="modal-section-title">Skills</div>
    <div class="modal-skills">${w.tags.map(t => `<span class="modal-skill-tag">${t}</span>`).join('')}</div>
    <div class="modal-section-title">Recent Reviews</div>
    <div class="modal-reviews">
      ${TESTIMONIALS.slice(0,2).map(t => `
        <div class="mini-review">
          <div class="mini-review-header">
            <span class="mini-review-name">${t.name}</span>
            <span class="mini-review-stars">${'★'.repeat(t.rating)}</span>
          </div>
          <p class="mini-review-text">${t.text.slice(0,100)}...</p>
        </div>
      `).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="bookWorker(${w.id})"><i class="fa-solid fa-calendar-check"></i> Book Now</button>
      <a href="chat.html" class="btn btn-outline"><i class="fa-solid fa-comment"></i> Message</a>
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('profileModal')) return;
  const modal = document.getElementById('profileModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function bookWorker(id) {
  const w = WORKERS.find(x => x.id === id);
  if (w) { sessionStorage.setItem('selectedWorker', JSON.stringify(w)); }
  window.location.href = 'booking.html';
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card glass-card reveal">
      <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar" style="background:linear-gradient(135deg,${t.color},${t.color}99);">${t.avatar}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FREELANCER PAGE ───────────────────────────────────────────────────────────
function renderFreelancerPage() {
  renderWorkerCards('freelancerGrid', WORKERS);
  updateResultsCount(WORKERS.length);

  // apply saved filter from home
  const savedFilter = sessionStorage.getItem('workerFilter');
  if (savedFilter) {
    document.querySelectorAll('.cat-filter').forEach(cb => {
      if (cb.value === savedFilter) { cb.checked = true; }
    });
    applyFilters();
    sessionStorage.removeItem('workerFilter');
  }
}

let currentView = 'grid';
function setView(view, btn) {
  currentView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('freelancerGrid');
  if (!grid) return;
  if (view === 'list') { grid.classList.add('list-view'); }
  else                 { grid.classList.remove('list-view'); }
}

function applyFilters() {
  const search   = (document.getElementById('sidebarSearch')?.value || '').toLowerCase();
  const minRating = parseFloat(document.getElementById('ratingFilter')?.value || '1');
  const minPrice  = parseFloat(document.getElementById('minPrice')?.value || '0');
  const maxPrice  = parseFloat(document.getElementById('maxPrice')?.value || 'Infinity');
  const sortBy    = document.getElementById('sortBy')?.value || 'rating';
  const catFilters = [...document.querySelectorAll('.cat-filter:checked')].map(cb => cb.value);

  let filtered = WORKERS.filter(w => {
    const matchSearch = !search || w.name.toLowerCase().includes(search) || w.skill.toLowerCase().includes(search) || w.tags.some(t => t.toLowerCase().includes(search));
    const matchCat    = catFilters.length === 0 || catFilters.includes(w.category);
    const matchRating = w.rating >= minRating;
    const matchPrice  = w.price >= minPrice && w.price <= (maxPrice || Infinity);
    return matchSearch && matchCat && matchRating && matchPrice;
  });

  filtered.sort((a,b) => {
    if (sortBy === 'rating')     return b.rating - a.rating;
    if (sortBy === 'price_low')  return a.price  - b.price;
    if (sortBy === 'price_high') return b.price  - a.price;
    if (sortBy === 'jobs')       return b.jobs   - a.jobs;
    return 0;
  });

  renderWorkerCards('freelancerGrid', filtered);
  updateResultsCount(filtered.length);
}

function resetFilters() {
  document.querySelectorAll('.cat-filter').forEach(cb => cb.checked = false);
  if (document.getElementById('sidebarSearch'))  document.getElementById('sidebarSearch').value = '';
  if (document.getElementById('ratingFilter'))   document.getElementById('ratingFilter').value = '1';
  if (document.getElementById('minPrice'))       document.getElementById('minPrice').value = '';
  if (document.getElementById('maxPrice'))       document.getElementById('maxPrice').value = '';
  if (document.getElementById('sortBy'))         document.getElementById('sortBy').value = 'rating';
  updateRatingLabel({ value: '1' });
  renderWorkerCards('freelancerGrid', WORKERS);
  updateResultsCount(WORKERS.length);
}

function updateRatingLabel(input) {
  const el = document.getElementById('ratingLabel');
  if (el) el.textContent = `${input.value}★ & above`;
}

function updateResultsCount(count) {
  const el = document.getElementById('resultsCount');
  if (el) el.textContent = `Showing ${count} professional${count !== 1 ? 's' : ''}`;
}

// ── FILTER BUTTONS (Home page) ────────────────────────────────────────────────
function initFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      const workers = filter === 'all' ? WORKERS.slice(0,6) : WORKERS.filter(w => w.category === filter).slice(0,6);
      renderWorkerCards('workersGrid', workers);
    });
  });
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function initDashboard() {
  // Saved workers
  renderWorkerCards('savedWorkers', WORKERS.slice(0,4));

  // Bookings list
  const bl = document.getElementById('dashBookingsList');
  if (bl) {
    const BOOKINGS = [
      { service:'Electrical Repair', worker:'Rajesh Kumar', date:'Dec 20, 2024 · 10 AM', status:'pending',   amount:'₹1,500', icon:'fa-bolt' },
      { service:'Plumbing Fix',      worker:'Suresh Patel', date:'Dec 22, 2024 · 2 PM',  status:'active',    amount:'₹800',   icon:'fa-faucet' },
      { service:'Web Development',   worker:'Priya Sharma', date:'Dec 15, 2024',          status:'completed', amount:'₹8,000', icon:'fa-code' },
      { service:'Room Painting',     worker:'Vikram Singh', date:'Dec 12, 2024',          status:'completed', amount:'₹2,200', icon:'fa-paint-roller' },
    ];
    bl.innerHTML = BOOKINGS.map(b => `
      <div class="glass-card" style="padding:20px;display:grid;grid-template-columns:2fr 1.5fr 1fr 1fr 1fr;align-items:center;gap:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="width:36px;height:36px;background:rgba(37,99,235,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--primary-light);">
            <i class="fa-solid ${b.icon}"></i>
          </span>
          <strong style="font-size:0.875rem;">${b.service}</strong>
        </div>
        <span style="font-size:0.875rem;color:var(--text-muted);">${b.worker}</span>
        <span style="font-size:0.8rem;color:var(--text-muted);">${b.date}</span>
        <span class="status-badge ${b.status}">${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
        <span style="font-weight:600;">${b.amount}</span>
      </div>
    `).join('');
  }

  // Reviews
  const rl = document.getElementById('myReviewsList');
  if (rl) {
    rl.innerHTML = TESTIMONIALS.slice(0,3).map(t => `
      <div class="glass-card" style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <strong style="font-size:0.875rem;">Rajesh Kumar — Electrical Work</strong>
          <span style="color:var(--warning);">${'★'.repeat(t.rating)}</span>
        </div>
        <p style="color:var(--text-muted);font-size:0.82rem;">${t.text.slice(0,80)}...</p>
        <span style="font-size:0.72rem;color:var(--text-faint);margin-top:6px;display:block;">Dec 12, 2024</span>
      </div>
    `).join('');
  }
}

function showDashSection(id, linkEl) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(l => l.classList.remove('active'));
  const section = document.getElementById(id);
  if (section) section.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── NAVBAR SCROLL ─────────────────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();

  if (document.getElementById('heroCanvas'))    initHeroCanvas();
  if (document.getElementById('typedText'))     initTypedText();
  if (document.getElementById('categoriesGrid')) renderCategories();
  if (document.getElementById('workersGrid'))   renderWorkerCards();
  if (document.getElementById('testimonialsGrid')) renderTestimonials();
  if (document.getElementById('workersGrid'))   initFilterButtons();

  // Re-observe reveal elements after rendering
  setTimeout(() => initScrollReveal(), 100);
});

// CTA particles (CSS only background, no extra JS needed)
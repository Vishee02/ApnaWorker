/* ===== APNAWORKER ADMIN PANEL JS ===== */
'use strict';

// ── CREDENTIALS ───────────────────────────────────────────────────────────────
const ADMIN_CREDS = { email:'admin@apnaworker.com', password:'admin123' };

// ── DATA STORE ────────────────────────────────────────────────────────────────
let STORE = {
  users: [
    {id:1,name:'Rahul Sharma',    email:'rahul@example.com',  phone:'+91 98765 43210',role:'client',   city:'Varanasi', joined:'2024-10-01',status:'active',  bookings:8,  spent:12400},
    {id:2,name:'Ananya Singh',    email:'ananya@example.com', phone:'+91 87654 32109',role:'client',   city:'Lucknow',  joined:'2024-10-15',status:'active',  bookings:3,  spent:4800},
    {id:3,name:'Vikash Gupta',    email:'vikash@example.com', phone:'+91 76543 21098',role:'client',   city:'Noida',    joined:'2024-11-01',status:'active',  bookings:12, spent:28000},
    {id:4,name:'Sunita Devi',     email:'sunita@example.com', phone:'+91 65432 10987',role:'client',   city:'Agra',     joined:'2024-09-20',status:'banned',  bookings:2,  spent:1200},
    {id:5,name:'Rohan Mehta',     email:'rohan@example.com',  phone:'+91 54321 09876',role:'client',   city:'Delhi',    joined:'2024-11-20',status:'active',  bookings:5,  spent:9600},
    {id:6,name:'Super Admin',     email:'admin@apnaworker.com',phone:'+91 11111 11111',role:'admin',   city:'Mumbai',   joined:'2024-01-01',status:'active',  bookings:0,  spent:0},
  ],
  workers: [
    {id:1, name:'Rajesh Kumar',  skill:'Electrician',location:'Varanasi',rating:4.9,jobs:210,earnings:89500, status:'approved',verified:true,  avatar:'RK',color:'#2563eb',phone:'+91 98765 00001'},
    {id:2, name:'Suresh Patel',  skill:'Plumber',    location:'Lucknow', rating:4.7,jobs:160,earnings:54000, status:'approved',verified:true,  avatar:'SP',color:'#06b6d4',phone:'+91 98765 00002'},
    {id:3, name:'Priya Sharma',  skill:'Developer',  location:'Noida',   rating:4.9,jobs:95, earnings:212000,status:'approved',verified:true,  avatar:'PS',color:'#8b5cf6',phone:'+91 98765 00003'},
    {id:4, name:'Vikram Singh',  skill:'Painter',    location:'Agra',    rating:4.6,jobs:130,earnings:38500, status:'approved',verified:true,  avatar:'VS',color:'#ec4899',phone:'+91 98765 00004'},
    {id:5, name:'Amit Joshi',    skill:'Carpenter',  location:'Kanpur',  rating:4.8,jobs:180,earnings:72000, status:'approved',verified:true,  avatar:'AJ',color:'#84cc16',phone:'+91 98765 00005'},
    {id:6, name:'Neha Gupta',    skill:'Designer',   location:'Delhi',   rating:5.0,jobs:78, earnings:180000,status:'approved',verified:true,  avatar:'NG',color:'#f97316',phone:'+91 98765 00006'},
    {id:7, name:'Ravi Sharma',   skill:'Mechanic',   location:'Prayagraj',rating:4.4,jobs:95,earnings:28000, status:'pending', verified:false, avatar:'RS',color:'#14b8a6',phone:'+91 98765 00007'},
    {id:8, name:'Kavita Mishra', skill:'Cleaner',    location:'Varanasi',rating:4.7,jobs:420,earnings:52000, status:'approved',verified:true,  avatar:'KM',color:'#f59e0b',phone:'+91 98765 00008'},
  ],
  bookings: [
    {id:'BK001',client:'Rahul Sharma',  worker:'Rajesh Kumar', service:'Electrician',date:'2024-12-18',amount:1575, status:'completed'},
    {id:'BK002',client:'Ananya Singh',  worker:'Suresh Patel', service:'Plumber',    date:'2024-12-20',amount:840,  status:'pending'},
    {id:'BK003',client:'Vikash Gupta',  worker:'Priya Sharma', service:'Developer',  date:'2024-12-15',amount:8400, status:'completed'},
    {id:'BK004',client:'Sunita Devi',   worker:'Vikram Singh', service:'Painter',    date:'2024-12-22',amount:2310, status:'active'},
    {id:'BK005',client:'Rohan Mehta',   worker:'Neha Gupta',   service:'Designer',   date:'2024-12-19',amount:6300, status:'completed'},
    {id:'BK006',client:'Rahul Sharma',  worker:'Amit Joshi',   service:'Carpenter',  date:'2024-12-23',amount:1260, status:'pending'},
    {id:'BK007',client:'Vikash Gupta',  worker:'Kavita Mishra',service:'Cleaner',    date:'2024-12-16',amount:630,  status:'cancelled'},
    {id:'BK008',client:'Rohan Mehta',   worker:'Rajesh Kumar', service:'Electrician',date:'2024-12-24',amount:1050, status:'pending'},
  ],
  categories: [
    {id:1,name:'Electrician',icon:'⚡',color:'#f59e0b',count:'2.4K',desc:'Home & commercial electrical work',active:true},
    {id:2,name:'Plumber',    icon:'🔧',color:'#06b6d4',count:'1.8K',desc:'Pipe fitting and plumbing repairs',active:true},
    {id:3,name:'Painter',    icon:'🎨',color:'#8b5cf6',count:'1.2K',desc:'Interior and exterior painting',active:true},
    {id:4,name:'Developer',  icon:'💻',color:'#2563eb',count:'3.1K',desc:'Web and app development',active:true},
    {id:5,name:'Designer',   icon:'🖌️',color:'#ec4899',count:'980', desc:'UI/UX and graphic design',active:true},
    {id:6,name:'Carpenter',  icon:'🪚',color:'#84cc16',count:'760', desc:'Furniture and woodwork',active:true},
    {id:7,name:'Mechanic',   icon:'🔩',color:'#f97316',count:'1.1K',desc:'Vehicle and appliance repair',active:true},
    {id:8,name:'Cleaner',    icon:'🧹',color:'#14b8a6',count:'2.0K',desc:'Home and office cleaning',active:true},
  ],
  services: [
    {id:1,name:'Switchboard Repair',  category:'Electrician',price:400,  workers:12,bookings:145,active:true},
    {id:2,name:'Fan Installation',    category:'Electrician',price:250,  workers:18,bookings:210,active:true},
    {id:3,name:'Pipe Leak Fix',       category:'Plumber',    price:350,  workers:9, bookings:98, active:true},
    {id:4,name:'Full House Painting', category:'Painter',    price:8000, workers:6, bookings:34, active:true},
    {id:5,name:'Website Development', category:'Developer',  price:15000,workers:24,bookings:62, active:true},
    {id:6,name:'Logo Design',         category:'Designer',   price:2000, workers:15,bookings:87, active:true},
    {id:7,name:'Deep Home Cleaning',  category:'Cleaner',    price:1200, workers:22,bookings:178,active:true},
    {id:8,name:'Furniture Assembly',  category:'Carpenter',  price:800,  workers:8, bookings:56, active:true},
  ],
  payments: [
    {id:'TXN001',user:'Rahul Sharma',  worker:'Rajesh Kumar', amount:1575, method:'UPI',   date:'2024-12-18',status:'success'},
    {id:'TXN002',user:'Ananya Singh',  worker:'Suresh Patel', amount:840,  method:'Card',  date:'2024-12-20',status:'pending'},
    {id:'TXN003',user:'Vikash Gupta',  worker:'Priya Sharma', amount:8400, method:'UPI',   date:'2024-12-15',status:'success'},
    {id:'TXN004',user:'Sunita Devi',   worker:'Vikram Singh', amount:2310, method:'Wallet',date:'2024-12-22',status:'success'},
    {id:'TXN005',user:'Rohan Mehta',   worker:'Neha Gupta',   amount:6300, method:'Card',  date:'2024-12-19',status:'success'},
    {id:'TXN006',user:'Vikash Gupta',  worker:'Kavita Mishra',amount:630,  method:'UPI',   date:'2024-12-16',status:'refunded'},
  ],
  payouts: [
    {id:1,worker:'Rajesh Kumar',amount:8500,  bank:'SBI •••4321',requested:'2024-12-18',status:'pending'},
    {id:2,worker:'Priya Sharma', amount:21000, bank:'HDFC •••7890',requested:'2024-12-16',status:'pending'},
    {id:3,worker:'Neha Gupta',   amount:15000, bank:'Axis •••2345',requested:'2024-12-15',status:'paid'},
    {id:4,worker:'Amit Joshi',   amount:6200,  bank:'UPI: amitj@okicici',requested:'2024-12-12',status:'paid'},
  ],
  coupons: [
    {id:1,code:'WELCOME20',value:20,type:'percent',minOrder:500,  uses:0,  maxUses:500, expiry:'2025-03-31',active:true},
    {id:2,code:'FLAT100',  value:100,type:'flat',  minOrder:800,  uses:142,maxUses:300, expiry:'2025-01-31',active:true},
    {id:3,code:'FESTIVE50',value:50, type:'percent',minOrder:1000, uses:890,maxUses:1000,expiry:'2025-01-15',active:false},
  ],
  reviews: [
    {id:1,reviewer:'Rahul Sharma', worker:'Rajesh Kumar',rating:5,text:'Outstanding work! Fixed everything within an hour.',date:'2024-12-18',status:'published'},
    {id:2,reviewer:'Ananya Singh', worker:'Suresh Patel', rating:4,text:'Good plumber, arrived on time.',date:'2024-12-17',status:'published'},
    {id:3,reviewer:'Vikash Gupta', worker:'Priya Sharma', rating:5,text:'Built our entire website. Extremely professional!',date:'2024-12-15',status:'pending'},
    {id:4,reviewer:'Rohan Mehta',  worker:'Neha Gupta',   rating:3,text:'Good design but missed deadline by one day.',date:'2024-12-14',status:'pending'},
  ],
  cities: [
    {id:1,name:'Varanasi',state:'Uttar Pradesh',workers:45,status:'active'},
    {id:2,name:'Lucknow',  state:'Uttar Pradesh',workers:78,status:'active'},
    {id:3,name:'Noida',    state:'Uttar Pradesh',workers:120,status:'active'},
    {id:4,name:'Agra',     state:'Uttar Pradesh',workers:34,status:'active'},
    {id:5,name:'Kanpur',   state:'Uttar Pradesh',workers:56,status:'active'},
    {id:6,name:'Delhi',    state:'Delhi',         workers:210,status:'active'},
    {id:7,name:'Mumbai',   state:'Maharashtra',   workers:0,  status:'coming_soon'},
    {id:8,name:'Jaipur',   state:'Rajasthan',     workers:0,  status:'coming_soon'},
  ],
  banners: [
    {id:1,title:'Book Verified Professionals',subtitle:'Fast, Reliable, Affordable',link:'freelancer.html',color:'#2563eb',position:'Homepage Hero',active:true},
    {id:2,title:'Festive Offer — 20% Off',subtitle:'Use code FESTIVE20',link:'freelancer.html',color:'#f59e0b',position:'Homepage Mid',active:true},
    {id:3,title:'Become a Pro Worker',subtitle:'Earn up to ₹50,000/month',link:'register.html',color:'#8b5cf6',position:'Sidebar',active:false},
  ],
  notifications: [
    {title:'New Year Offer!',message:'Get 20% off all bookings in January 2025.',target:'all',type:'promo',time:'2 hours ago'},
    {title:'Platform Update',message:'Chat feature upgraded with image sharing.',target:'all',type:'update',time:'Yesterday'},
  ],
  posts: [
    {id:1,title:'How to Choose the Right Electrician',author:'Admin',category:'Tips',date:'2024-12-10',status:'published'},
    {id:2,title:'Top 5 Plumbing Problems & Fixes',     author:'Admin',category:'Guide',date:'2024-12-05',status:'published'},
    {id:3,title:'Why ApnaWorker Workers are Verified',  author:'Admin',category:'About',date:'2024-11-28',status:'draft'},
  ],
};

// ── AUTH ──────────────────────────────────────────────────────────────────────
function adminLogin() {
  const email    = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const err      = document.getElementById('loginError');
  if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
    sessionStorage.setItem('aw_admin_auth','1');
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display       = 'grid';
    initAdminPanel();
  } else {
    err.style.display = 'block';
    err.textContent   = 'Invalid email or password. Try admin@apnaworker.com / admin123';
  }
}

function adminLogout() {
  sessionStorage.removeItem('aw_admin_auth');
  document.getElementById('adminPanel').style.display       = 'none';
  document.getElementById('adminLoginScreen').style.display = 'flex';
}

// Auto-login if already authenticated
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('aw_admin_auth') === '1') {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display       = 'grid';
    initAdminPanel();
  }
  // Enter key on login
  document.getElementById('adminPassword')?.addEventListener('keydown', e => { if(e.key==='Enter') adminLogin(); });
});

// ── INIT ──────────────────────────────────────────────────────────────────────
function initAdminPanel() {
  renderOverview();
  renderCharts();
  renderUsersTable();
  renderWorkersTable();
  renderBookingsTable();
  renderCategoriesGrid();
  renderServicesTable();
  renderPaymentsTable();
  renderPayoutsTable();
  renderCouponsTable();
  renderReviews();
  renderSentNotifications();
  renderBanners();
  renderCMSTable();
  renderCitiesGrid();
}

// ── SECTION NAVIGATION ────────────────────────────────────────────────────────
function showSection(id, linkEl) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById(`sec-${id}`);
  if (sec) sec.classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  const title = document.getElementById('topbarTitle');
  if (title) title.textContent = id.charAt(0).toUpperCase() + id.slice(1);
  if (window.innerWidth < 860) closeSidebar();
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('adminSidebar').classList.remove('open');
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function renderOverview() {
  const totalRevenue = STORE.payments.filter(p=>p.status==='success').reduce((a,p)=>a+p.amount,0);
  const stats = [
    {label:'Total Revenue',   val:`₹${(totalRevenue/1000).toFixed(1)}K`, icon:'fa-indian-rupee-sign',color:'#2563eb',bg:'rgba(37,99,235,0.15)',  change:'+18.2%',up:true},
    {label:'Total Bookings',  val:STORE.bookings.length,                  icon:'fa-calendar-check',  color:'#10b981',bg:'rgba(16,185,129,0.15)', change:'+12.5%',up:true},
    {label:'Active Workers',  val:STORE.workers.filter(w=>w.status==='approved').length, icon:'fa-hard-hat',color:'#8b5cf6',bg:'rgba(139,92,246,0.15)',change:'+8.3%',up:true},
    {label:'Total Users',     val:STORE.users.filter(u=>u.role==='client').length, icon:'fa-users',color:'#f59e0b',bg:'rgba(245,158,11,0.15)', change:'+24.1%',up:true},
  ];
  document.getElementById('overviewStats').innerHTML = stats.map(s=>`
    <div class="stat-card">
      <div class="stat-icon" style="background:${s.bg};color:${s.color};"><i class="fa-solid ${s.icon}"></i></div>
      <div>
        <span class="stat-val" style="background:linear-gradient(135deg,${s.color},#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${s.val}</span>
        <span class="stat-label">${s.label}</span>
        <span class="stat-change ${s.up?'up':'down'}">${s.change} this month</span>
      </div>
    </div>
  `).join('');

  // Recent bookings table inside overview
  const rb = document.getElementById('recentBookingsTable');
  if(rb) {
    rb.innerHTML = `<table class="atable"><thead><tr><th>ID</th><th>Client</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${STORE.bookings.slice(0,5).map(b=>`
      <tr><td>${b.id}</td><td>${b.client}</td><td>${b.service}</td><td>₹${b.amount}</td><td>${statusBadge(b.status)}</td></tr>
    `).join('')}</tbody></table>`;
  }

  // Pending actions
  const pa = document.getElementById('pendingActions');
  if(pa) {
    const pending = [
      {icon:'fa-hard-hat',color:'rgba(245,158,11,0.15)',iconColor:'#f59e0b',label:`${STORE.workers.filter(w=>w.status==='pending').length} Workers awaiting approval`,action:'Approve',fn:"showSection('workers',null)"},
      {icon:'fa-star',    color:'rgba(37,99,235,0.15)',  iconColor:'#3b82f6',label:`${STORE.reviews.filter(r=>r.status==='pending').length} Reviews pending moderation`,action:'Review', fn:"showSection('reviews',null)"},
      {icon:'fa-wallet',  color:'rgba(139,92,246,0.15)', iconColor:'#8b5cf6',label:`${STORE.payouts.filter(p=>p.status==='pending').length} Payout requests pending`,    action:'Process',fn:"showSection('payouts',null)"},
    ];
    pa.innerHTML = pending.map(p=>`
      <div class="pending-item">
        <div class="pending-icon" style="background:${p.color};color:${p.iconColor};"><i class="fa-solid ${p.icon}"></i></div>
        <div class="pending-info"><strong>${p.label}</strong></div>
        <button class="abtn abtn-sm abtn-outline pending-action" onclick="${p.fn}">${p.action}</button>
      </div>
    `).join('');
  }
}

// ── CHARTS (Pure CSS/Canvas) ──────────────────────────────────────────────────
function renderCharts() {
  // Revenue Chart
  const rCtx = document.getElementById('revenueChart');
  if(rCtx) drawBarChart(rCtx, ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], [4200,6800,3900,8100,5600,9200,7400], '#2563eb', '#06b6d4');

  // Category Chart
  const cCtx = document.getElementById('categoryChart');
  if(cCtx) drawDonutChart(cCtx, ['Electrician','Plumber','Developer','Designer','Other'],
    [32,18,25,15,10], ['#2563eb','#06b6d4','#8b5cf6','#ec4899','#10b981']);

  // Analytics Chart
  const aCtx = document.getElementById('analyticsChart');
  if(aCtx) {
    const labels = Array.from({length:30},(_,i)=>`Dec ${i+1}`);
    const data   = Array.from({length:30},()=>Math.floor(Math.random()*8000+2000));
    drawBarChart(aCtx, labels, data, '#8b5cf6','#2563eb');
  }
}

function drawBarChart(canvas, labels, data, color1, color2) {
  const ctx = canvas.getContext('2d');
  const W=canvas.offsetWidth||600, H=canvas.height||220;
  canvas.width=W; canvas.height=H;
  const max=Math.max(...data), pad={t:20,r:20,b:50,l:50};
  const bw=(W-pad.l-pad.r)/data.length - 8;
  ctx.clearRect(0,0,W,H);

  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
  for(let i=0;i<=4;i++) {
    const y=pad.t+(H-pad.t-pad.b)*i/4;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
    ctx.fillStyle='rgba(148,163,184,0.6)'; ctx.font='10px Poppins'; ctx.textAlign='right';
    ctx.fillText(Math.round(max*(4-i)/4),pad.l-6,y+4);
  }

  data.forEach((v,i) => {
    const x=pad.l+i*(bw+8);
    const bh=(v/max)*(H-pad.t-pad.b);
    const y=H-pad.b-bh;
    const g=ctx.createLinearGradient(0,y,0,H-pad.b);
    g.addColorStop(0,color1); g.addColorStop(1,color2+'44');
    ctx.fillStyle=g;
    const r=Math.min(6,bw/2);
    ctx.beginPath();
    ctx.roundRect(x,y,bw,bh,r);
    ctx.fill();

    if(i%Math.ceil(data.length/7)===0) {
      ctx.fillStyle='rgba(148,163,184,0.7)';ctx.font='9px Poppins';ctx.textAlign='center';
      ctx.fillText(labels[i],x+bw/2,H-pad.b+14);
    }
  });
}

function drawDonutChart(canvas, labels, data, colors) {
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth||300, H=canvas.height||220;
  canvas.width=W; canvas.height=H;
  const total=data.reduce((a,b)=>a+b,0);
  const cx=W/2-40, cy=H/2, r=Math.min(cx,cy)*0.85, ir=r*0.6;
  let ang=-Math.PI/2;
  data.forEach((v,i) => {
    const slice=(v/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,ang,ang+slice);
    ctx.closePath(); ctx.fillStyle=colors[i]; ctx.fill();
    ang+=slice;
  });
  // Donut hole
  ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2);
  ctx.fillStyle='rgba(15,23,42,0.9)'; ctx.fill();
  // Center text
  ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 16px Poppins'; ctx.textAlign='center';
  ctx.fillText(total+'%',cx,cy-4);
  ctx.font='10px Poppins'; ctx.fillStyle='rgba(148,163,184,0.7)';
  ctx.fillText('Total',cx,cy+14);
  // Legend
  const lx=W-90;
  labels.forEach((l,i) => {
    const ly=20+i*26;
    ctx.fillStyle=colors[i]; ctx.fillRect(lx,ly,12,12);
    ctx.fillStyle='rgba(148,163,184,0.9)';ctx.font='10px Poppins';ctx.textAlign='left';
    ctx.fillText(`${l} (${data[i]}%)`,lx+16,ly+10);
  });
}

// ── USERS TABLE ───────────────────────────────────────────────────────────────
function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  const count = document.getElementById('userCount');
  if(!tbody) return;
  const clients = STORE.users.filter(u=>u.role!=='admin');
  if(count) count.textContent = clients.length;
  tbody.innerHTML = clients.map(u=>`
    <tr id="user-row-${u.id}">
      <td><div class="worker-mini">
        <div class="mini-av" style="background:linear-gradient(135deg,#2563eb,#06b6d4);">${u.name.charAt(0)}</div>
        <div><strong style="font-size:.85rem;">${u.name}</strong><br><span style="font-size:.72rem;color:var(--muted);">${u.bookings} bookings · ₹${u.spent.toLocaleString()} spent</span></div>
      </div></td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td><span class="sbadge ${u.role==='admin'?'sbadge-blue':'sbadge-gray'}">${u.role}</span></td>
      <td style="color:var(--muted);font-size:.82rem;">${u.joined}</td>
      <td>${u.status==='active'?'<span class="sbadge sbadge-green">Active</span>':'<span class="sbadge sbadge-red">Banned</span>'}</td>
      <td><div class="atable-actions">
        ${u.status==='active'
          ?`<button class="abtn abtn-sm abtn-danger" onclick="toggleUserBan(${u.id})"><i class="fa-solid fa-ban"></i> Ban</button>`
          :`<button class="abtn abtn-sm abtn-success" onclick="toggleUserBan(${u.id})"><i class="fa-solid fa-check"></i> Unban</button>`}
        <button class="abtn abtn-sm abtn-outline" onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function toggleUserBan(id) {
  const u = STORE.users.find(x=>x.id===id);
  if(!u) return;
  u.status = u.status==='active'?'banned':'active';
  renderUsersTable();
  toast(`User ${u.name} ${u.status==='banned'?'banned':'unbanned'} successfully.`, u.status==='banned'?'warning':'success');
}

function deleteUser(id) {
  if(!confirm('Delete this user permanently?')) return;
  STORE.users = STORE.users.filter(u=>u.id!==id);
  renderUsersTable();
  toast('User deleted.','error');
}

function addUser() {
  const fn   = document.getElementById('uFirstName').value.trim();
  const ln   = document.getElementById('uLastName').value.trim();
  const email= document.getElementById('uEmail').value.trim();
  const phone= document.getElementById('uPhone').value.trim();
  const role = document.getElementById('uRole').value;
  const city = document.getElementById('uCity').value.trim();
  if(!fn||!email) { toast('Name and email are required.','error'); return; }
  const newUser = {
    id: Date.now(), name:`${fn} ${ln}`, email, phone, role, city,
    joined: new Date().toISOString().split('T')[0], status:'active', bookings:0, spent:0
  };
  STORE.users.push(newUser);
  closeModal('addUserModal');
  renderUsersTable();
  toast(`User ${newUser.name} added.`,'success');
}

// ── WORKERS TABLE ─────────────────────────────────────────────────────────────
function renderWorkersTable(data=STORE.workers) {
  const tbody = document.getElementById('workersTableBody');
  const count = document.getElementById('workerCount');
  if(!tbody) return;
  if(count) count.textContent = data.length;
  tbody.innerHTML = data.map(w=>`
    <tr id="worker-row-${w.id}">
      <td><div class="worker-mini">
        <div class="mini-av" style="background:linear-gradient(135deg,${w.color},${w.color}99);">${w.avatar}</div>
        <div>
          <strong style="font-size:.85rem;">${w.name}</strong>
          ${w.verified?'<i class="fa-solid fa-shield-halved" style="color:#10b981;font-size:.7rem;margin-left:4px;" title="Verified"></i>':''}
          <br><span style="font-size:.72rem;color:var(--muted);">${w.phone}</span>
        </div>
      </div></td>
      <td><span class="sbadge sbadge-blue">${w.skill}</span></td>
      <td style="color:var(--muted);font-size:.82rem;"><i class="fa-solid fa-location-dot" style="color:#ef4444;margin-right:4px;"></i>${w.location}</td>
      <td><span style="color:#f59e0b;">★</span> ${w.rating}</td>
      <td>${w.jobs}+</td>
      <td>₹${(w.earnings/1000).toFixed(1)}K</td>
      <td>${statusBadge(w.status)}</td>
      <td><div class="atable-actions">
        ${w.status==='pending'
          ?`<button class="abtn abtn-sm abtn-success" onclick="approveWorker(${w.id})"><i class="fa-solid fa-check"></i> Approve</button>`
          :`<button class="abtn abtn-sm abtn-outline" onclick="approveWorker(${w.id})">Edit</button>`}
        ${w.status==='approved'
          ?`<button class="abtn abtn-sm abtn-danger" onclick="banWorker(${w.id})"><i class="fa-solid fa-ban"></i></button>`
          :`<button class="abtn abtn-sm abtn-success" onclick="banWorker(${w.id})"><i class="fa-solid fa-check"></i></button>`}
        <button class="abtn abtn-sm abtn-danger" onclick="deleteWorker(${w.id})"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function filterByApproval(status) {
  if(!status) renderWorkersTable();
  else renderWorkersTable(STORE.workers.filter(w=>w.status===status));
}

function approveWorker(id) {
  const w = STORE.workers.find(x=>x.id===id);
  if(!w) return;
  w.status = 'approved'; w.verified = true;
  renderWorkersTable(); toast(`${w.name} approved and verified.`,'success');
}

function banWorker(id) {
  const w = STORE.workers.find(x=>x.id===id);
  if(!w) return;
  w.status = w.status==='banned'?'approved':'banned';
  renderWorkersTable(); toast(`${w.name} ${w.status==='banned'?'banned':'unbanned'}.`,w.status==='banned'?'warning':'success');
}

function deleteWorker(id) {
  if(!confirm('Delete this worker permanently?')) return;
  STORE.workers = STORE.workers.filter(w=>w.id!==id);
  renderWorkersTable(); toast('Worker deleted.','error');
}

function addWorker() {
  const fn   = document.getElementById('wFirstName').value.trim();
  const ln   = document.getElementById('wLastName').value.trim();
  const email= document.getElementById('wEmail').value.trim();
  const phone= document.getElementById('wPhone').value.trim();
  const skill= document.getElementById('wSkill').value;
  const rate = parseInt(document.getElementById('wRate').value)||500;
  const loc  = document.getElementById('wLocation').value.trim();
  const stat = document.getElementById('wStatus').value;
  const ver  = document.getElementById('wVerified').value==='true';
  if(!fn||!email) { toast('Name and email are required.','error'); return; }
  const colors=['#2563eb','#06b6d4','#8b5cf6','#ec4899','#84cc16','#f97316'];
  const newWorker = {
    id:Date.now(), name:`${fn} ${ln}`, skill, location:loc||'Not specified',
    rating:4.5, jobs:0, earnings:0, status:stat, verified:ver,
    avatar:`${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase(),
    color:colors[Math.floor(Math.random()*colors.length)],
    phone, price:rate
  };
  STORE.workers.push(newWorker);
  closeModal('addWorkerModal');
  renderWorkersTable();
  toast(`Worker ${newWorker.name} added.`,'success');
}

// ── BOOKINGS TABLE ────────────────────────────────────────────────────────────
function renderBookingsTable(data=STORE.bookings) {
  const tbody = document.getElementById('bookingsTableBody');
  const count = document.getElementById('bookingCount');
  if(!tbody) return;
  if(count) count.textContent = data.length;
  tbody.innerHTML = data.map(b=>`
    <tr>
      <td style="font-size:.78rem;color:var(--muted);">${b.id}</td>
      <td>${b.client}</td>
      <td>${b.worker}</td>
      <td><span class="sbadge sbadge-gray">${b.service}</span></td>
      <td style="color:var(--muted);font-size:.82rem;">${b.date}</td>
      <td>₹${b.amount.toLocaleString()}</td>
      <td>${statusBadge(b.status)}</td>
      <td><div class="atable-actions">
        <select class="ainput" style="padding:4px 8px;font-size:.72rem;width:120px;" onchange="changeBookingStatus('${b.id}',this.value)">
          <option value="pending" ${b.status==='pending'?'selected':''}>Pending</option>
          <option value="active"  ${b.status==='active' ?'selected':''}>Active</option>
          <option value="completed" ${b.status==='completed'?'selected':''}>Completed</option>
          <option value="cancelled" ${b.status==='cancelled'?'selected':''}>Cancelled</option>
        </select>
      </div></td>
    </tr>
  `).join('');
}

function changeBookingStatus(id, status) {
  const b = STORE.bookings.find(x=>x.id===id);
  if(b) { b.status=status; renderBookingsTable(); toast(`Booking ${id} → ${status}`,'success'); }
}

function filterBookingsByStatus(status) {
  if(!status) renderBookingsTable();
  else renderBookingsTable(STORE.bookings.filter(b=>b.status===status));
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
function renderCategoriesGrid() {
  const grid = document.getElementById('categoriesAdminGrid');
  if(!grid) return;
  grid.innerHTML = STORE.categories.map(c=>`
    <div class="cat-admin-card">
      <div class="cat-card-badge">${c.active?'Active':'Off'}</div>
      <span class="cat-admin-icon">${c.icon}</span>
      <div class="cat-admin-name">${c.name}</div>
      <div class="cat-admin-count">${c.count} professionals</div>
      <div class="cat-admin-actions">
        <button class="abtn abtn-sm abtn-outline" onclick="editCategory(${c.id})"><i class="fa-solid fa-pen"></i></button>
        <button class="abtn abtn-sm ${c.active?'abtn-danger':'abtn-success'}" onclick="toggleCategory(${c.id})">
          ${c.active?'<i class="fa-solid fa-toggle-off"></i> Hide':'<i class="fa-solid fa-toggle-on"></i> Show'}
        </button>
        <button class="abtn abtn-sm abtn-danger" onclick="deleteCategory(${c.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function toggleCategory(id) {
  const c=STORE.categories.find(x=>x.id===id);
  if(c) { c.active=!c.active; renderCategoriesGrid(); toast(`Category ${c.name} ${c.active?'enabled':'disabled'}.`,'success'); }
}

function deleteCategory(id) {
  if(!confirm('Delete this category?')) return;
  STORE.categories=STORE.categories.filter(c=>c.id!==id);
  renderCategoriesGrid(); toast('Category deleted.','error');
}

function editCategory(id) { toast('Edit mode — update fields above and save.','info'); }

function addCategory() {
  const name  = document.getElementById('catName').value.trim();
  const icon  = document.getElementById('catIcon').value.trim();
  const color = document.getElementById('catColor').value;
  const desc  = document.getElementById('catDesc').value.trim();
  if(!name||!icon) { toast('Name and icon are required.','error'); return; }
  STORE.categories.push({id:Date.now(),name,icon,color,desc,count:'0',active:true});
  closeModal('addCategoryModal');
  renderCategoriesGrid();
  toast(`Category "${name}" added successfully.`,'success');
}

// ── SERVICES TABLE ────────────────────────────────────────────────────────────
function renderServicesTable() {
  const tbody = document.getElementById('servicesTableBody');
  if(!tbody) return;
  tbody.innerHTML = STORE.services.map(s=>`
    <tr>
      <td><strong style="font-size:.85rem;">${s.name}</strong></td>
      <td><span class="sbadge sbadge-blue">${s.category}</span></td>
      <td>₹${s.price.toLocaleString()}</td>
      <td>${s.workers}</td>
      <td>${s.bookings}</td>
      <td>${s.active?'<span class="sbadge sbadge-green">Active</span>':'<span class="sbadge sbadge-gray">Hidden</span>'}</td>
      <td><div class="atable-actions">
        <button class="abtn abtn-sm abtn-outline" onclick="toast('Edit service — coming soon','info')"><i class="fa-solid fa-pen"></i></button>
        <button class="abtn abtn-sm abtn-danger" onclick="deleteService(${s.id})"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function deleteService(id) {
  if(!confirm('Delete this service?')) return;
  STORE.services=STORE.services.filter(s=>s.id!==id);
  renderServicesTable(); toast('Service deleted.','error');
}

// ── PAYMENTS TABLE ────────────────────────────────────────────────────────────
function renderPaymentsTable() {
  const tbody = document.getElementById('paymentsTableBody');
  const stats = document.getElementById('paymentStats');
  if(!tbody) return;
  tbody.innerHTML = STORE.payments.map(p=>`
    <tr>
      <td style="font-size:.75rem;color:var(--muted);">${p.id}</td>
      <td>${p.user}</td>
      <td>${p.worker}</td>
      <td style="font-weight:600;">₹${p.amount.toLocaleString()}</td>
      <td><span class="sbadge sbadge-gray">${p.method}</span></td>
      <td style="color:var(--muted);font-size:.82rem;">${p.date}</td>
      <td>${p.status==='success'?'<span class="sbadge sbadge-green">Success</span>':p.status==='refunded'?'<span class="sbadge sbadge-yellow">Refunded</span>':'<span class="sbadge sbadge-yellow">Pending</span>'}</td>
    </tr>
  `).join('');
  if(stats) {
    const total   = STORE.payments.filter(p=>p.status==='success').reduce((a,p)=>a+p.amount,0);
    const pending = STORE.payments.filter(p=>p.status==='pending').reduce((a,p)=>a+p.amount,0);
    const refunded= STORE.payments.filter(p=>p.status==='refunded').reduce((a,p)=>a+p.amount,0);
    const pstatsList = [
      {label:'Total Revenue',val:`₹${total.toLocaleString()}`,icon:'fa-indian-rupee-sign',color:'#10b981',bg:'rgba(16,185,129,0.15)'},
      {label:'Pending',      val:`₹${pending.toLocaleString()}`,icon:'fa-clock',           color:'#f59e0b',bg:'rgba(245,158,11,0.15)'},
      {label:'Refunded',     val:`₹${refunded.toLocaleString()}`,icon:'fa-rotate-left',    color:'#ef4444',bg:'rgba(239,68,68,0.15)'},
      {label:'Transactions', val:STORE.payments.length,          icon:'fa-receipt',          color:'#2563eb',bg:'rgba(37,99,235,0.15)'},
    ];
    stats.innerHTML = pstatsList.map(s=>`
      <div class="stat-card">
        <div class="stat-icon" style="background:${s.bg};color:${s.color};"><i class="fa-solid ${s.icon}"></i></div>
        <div><span class="stat-val" style="color:${s.color};">${s.val}</span><span class="stat-label">${s.label}</span></div>
      </div>
    `).join('');
  }
}

// ── PAYOUTS TABLE ─────────────────────────────────────────────────────────────
function renderPayoutsTable() {
  const tbody = document.getElementById('payoutsTableBody');
  if(!tbody) return;
  tbody.innerHTML = STORE.payouts.map(p=>`
    <tr>
      <td>${p.worker}</td>
      <td style="font-weight:600;">₹${p.amount.toLocaleString()}</td>
      <td style="color:var(--muted);font-size:.82rem;">${p.bank}</td>
      <td style="color:var(--muted);font-size:.82rem;">${p.requested}</td>
      <td>${p.status==='paid'?'<span class="sbadge sbadge-green">Paid</span>':'<span class="sbadge sbadge-yellow">Pending</span>'}</td>
      <td><div class="atable-actions">
        ${p.status==='pending'?`
          <button class="abtn abtn-sm abtn-success" onclick="processPayout(${p.id})"><i class="fa-solid fa-check"></i> Pay Now</button>
          <button class="abtn abtn-sm abtn-danger" onclick="rejectPayout(${p.id})"><i class="fa-solid fa-xmark"></i> Reject</button>
        `:`<span class="sbadge sbadge-green">Processed</span>`}
      </div></td>
    </tr>
  `).join('');
}

function processPayout(id) {
  const p=STORE.payouts.find(x=>x.id===id);
  if(p) { p.status='paid'; renderPayoutsTable(); toast(`Payout of ₹${p.amount} sent to ${p.worker}.`,'success'); }
}
function rejectPayout(id) {
  STORE.payouts=STORE.payouts.filter(p=>p.id!==id);
  renderPayoutsTable(); toast('Payout request rejected.','error');
}

// ── COUPONS TABLE ─────────────────────────────────────────────────────────────
function renderCouponsTable() {
  const tbody = document.getElementById('couponsTableBody');
  if(!tbody) return;
  tbody.innerHTML = STORE.coupons.map(c=>`
    <tr>
      <td><strong style="font-family:monospace;font-size:.9rem;letter-spacing:.05em;">${c.code}</strong></td>
      <td>${c.value}${c.type==='percent'?'%':'₹'}</td>
      <td><span class="sbadge sbadge-gray">${c.type==='percent'?'Percentage':'Flat'}</span></td>
      <td>₹${c.minOrder}</td>
      <td>${c.uses}/${c.maxUses}</td>
      <td style="color:var(--muted);font-size:.82rem;">${c.expiry}</td>
      <td>${c.active?'<span class="sbadge sbadge-green">Active</span>':'<span class="sbadge sbadge-gray">Expired</span>'}</td>
      <td><div class="atable-actions">
        <button class="abtn abtn-sm ${c.active?'abtn-danger':'abtn-success'}" onclick="toggleCoupon(${c.id})">${c.active?'Disable':'Enable'}</button>
        <button class="abtn abtn-sm abtn-danger" onclick="deleteCoupon(${c.id})"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}

function toggleCoupon(id) {
  const c=STORE.coupons.find(x=>x.id===id);
  if(c) { c.active=!c.active; renderCouponsTable(); toast(`Coupon ${c.code} ${c.active?'enabled':'disabled'}.`,'success'); }
}
function deleteCoupon(id) {
  STORE.coupons=STORE.coupons.filter(c=>c.id!==id);
  renderCouponsTable(); toast('Coupon deleted.','error');
}

function addCoupon() {
  const code   = document.getElementById('couponCode').value.trim().toUpperCase();
  const value  = parseInt(document.getElementById('couponValue').value)||10;
  const type   = document.getElementById('couponType').value;
  const minOrd = parseInt(document.getElementById('couponMin').value)||0;
  const maxUses= parseInt(document.getElementById('couponMaxUses').value)||100;
  const expiry = document.getElementById('couponExpiry').value;
  if(!code) { toast('Coupon code is required.','error'); return; }
  STORE.coupons.push({id:Date.now(),code,value,type,minOrder:minOrd,uses:0,maxUses,expiry,active:true});
  closeModal('addCouponModal');
  renderCouponsTable();
  toast(`Coupon "${code}" created.`,'success');
}

// ── REVIEWS ───────────────────────────────────────────────────────────────────
function renderReviews() {
  const list = document.getElementById('reviewsList');
  if(!list) return;
  list.innerHTML = STORE.reviews.map(r=>`
    <div class="review-item">
      <div class="review-header">
        <div class="review-meta">
          <strong>${r.reviewer} → ${r.worker}</strong>
          <span>${r.date}</span>
        </div>
        <div>
          <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
          ${r.status==='pending'?'<span class="sbadge sbadge-yellow" style="margin-left:8px;">Pending</span>':'<span class="sbadge sbadge-green" style="margin-left:8px;">Published</span>'}
        </div>
      </div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-actions">
        ${r.status==='pending'?`
          <button class="abtn abtn-sm abtn-success" onclick="approveReview(${r.id})"><i class="fa-solid fa-check"></i> Approve</button>
          <button class="abtn abtn-sm abtn-danger" onclick="deleteReview(${r.id})"><i class="fa-solid fa-trash"></i> Reject</button>
        `:`<button class="abtn abtn-sm abtn-danger" onclick="deleteReview(${r.id})"><i class="fa-solid fa-trash"></i> Remove</button>`}
      </div>
    </div>
  `).join('');
}

function approveReview(id) {
  const r=STORE.reviews.find(x=>x.id===id);
  if(r) { r.status='published'; renderReviews(); toast('Review approved and published.','success'); }
}
function deleteReview(id) {
  STORE.reviews=STORE.reviews.filter(r=>r.id!==id);
  renderReviews(); toast('Review removed.','error');
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function sendNotification() {
  const title   = document.getElementById('notifTitle')?.value.trim();
  const message = document.getElementById('notifMessage')?.value.trim();
  const target  = document.getElementById('notifTarget')?.value;
  const type    = document.getElementById('notifType')?.value;
  if(!title||!message) { toast('Title and message are required.','error'); return; }
  STORE.notifications.unshift({title,message,target,type,time:'Just now'});
  renderSentNotifications();
  document.getElementById('notifTitle').value   = '';
  document.getElementById('notifMessage').value = '';
  toast(`Notification sent to ${target}.`,'success');
}

function renderSentNotifications() {
  const list = document.getElementById('sentNotifications');
  if(!list) return;
  list.innerHTML = STORE.notifications.map(n=>`
    <div class="notif-sent-item">
      <div class="notif-sent-header">
        <span class="notif-sent-title">${n.title}</span>
        <span class="notif-sent-time">${n.time}</span>
      </div>
      <p class="notif-sent-msg">${n.message}</p>
      <span class="sbadge sbadge-gray" style="margin-top:6px;">${n.target} · ${n.type}</span>
    </div>
  `).join('');
}

// ── BANNERS ───────────────────────────────────────────────────────────────────
function renderBanners() {
  const grid = document.getElementById('bannersGrid');
  if(!grid) return;
  grid.innerHTML = STORE.banners.map(b=>`
    <div class="banner-card" style="background:linear-gradient(135deg,${b.color},${b.color}99);">
      <div class="banner-pos-tag">${b.position}</div>
      <div>
        <div class="banner-card-title">${b.title}</div>
        <div class="banner-card-sub">${b.subtitle}</div>
      </div>
      <div class="banner-card-actions">
        <button class="abtn abtn-sm" style="background:rgba(255,255,255,0.2);color:#fff;" onclick="toggleBanner(${b.id})">
          ${b.active?'<i class="fa-solid fa-eye-slash"></i> Hide':'<i class="fa-solid fa-eye"></i> Show'}
        </button>
        <button class="abtn abtn-sm" style="background:rgba(239,68,68,0.3);color:#fff;" onclick="deleteBanner(${b.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function toggleBanner(id) {
  const b=STORE.banners.find(x=>x.id===id);
  if(b) { b.active=!b.active; renderBanners(); toast(`Banner ${b.active?'shown':'hidden'}.`,'success'); }
}
function deleteBanner(id) {
  STORE.banners=STORE.banners.filter(b=>b.id!==id);
  renderBanners(); toast('Banner deleted.','error');
}
function addBanner() {
  const title    = document.getElementById('bannerTitle').value.trim();
  const subtitle = document.getElementById('bannerSubtitle').value.trim();
  const link     = document.getElementById('bannerLink').value.trim();
  const color    = document.getElementById('bannerColor').value;
  const position = document.getElementById('bannerPosition').value;
  if(!title) { toast('Title is required.','error'); return; }
  STORE.banners.push({id:Date.now(),title,subtitle,link,color,position,active:true});
  closeModal('addBannerModal');
  renderBanners();
  toast('Banner added.','success');
}

// ── CMS ───────────────────────────────────────────────────────────────────────
function renderCMSTable() {
  const tbody = document.getElementById('cmsTableBody');
  if(!tbody) return;
  tbody.innerHTML = STORE.posts.map(p=>`
    <tr>
      <td><strong style="font-size:.85rem;">${p.title}</strong></td>
      <td style="color:var(--muted);">${p.author}</td>
      <td><span class="sbadge sbadge-gray">${p.category}</span></td>
      <td style="color:var(--muted);font-size:.82rem;">${p.date}</td>
      <td>${p.status==='published'?'<span class="sbadge sbadge-green">Published</span>':'<span class="sbadge sbadge-yellow">Draft</span>'}</td>
      <td><div class="atable-actions">
        <button class="abtn abtn-sm abtn-outline" onclick="toast('Post editor coming soon','info')"><i class="fa-solid fa-pen"></i></button>
        <button class="abtn abtn-sm abtn-danger" onclick="deletePost(${p.id})"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join('');
}
function deletePost(id) {
  STORE.posts=STORE.posts.filter(p=>p.id!==id);
  renderCMSTable(); toast('Post deleted.','error');
}

// ── CITIES ────────────────────────────────────────────────────────────────────
function renderCitiesGrid() {
  const grid = document.getElementById('citiesGrid');
  if(!grid) return;
  grid.innerHTML = STORE.cities.map(c=>`
    <div class="city-card">
      <div class="city-info">
        <strong>${c.name}</strong>
        <span>${c.state} · ${c.workers} workers</span>
      </div>
      <div class="city-actions">
        <span class="sbadge ${c.status==='active'?'sbadge-green':'sbadge-yellow'}">${c.status==='active'?'Live':'Soon'}</span>
        <button class="abtn abtn-sm abtn-danger" onclick="deleteCity(${c.id})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}
function deleteCity(id) {
  STORE.cities=STORE.cities.filter(c=>c.id!==id);
  renderCitiesGrid(); toast('City removed.','error');
}
function addCity() {
  const name   = document.getElementById('cityName').value.trim();
  const state  = document.getElementById('cityState').value.trim();
  const status = document.getElementById('cityStatus').value;
  if(!name) { toast('City name is required.','error'); return; }
  STORE.cities.push({id:Date.now(),name,state,workers:0,status});
  closeModal('addCityModal');
  renderCitiesGrid();
  toast(`City "${name}" added.`,'success');
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────
let analyticsPeriod = 30;
function setAnalyticsPeriod(days, btn) {
  analyticsPeriod = days;
  document.querySelectorAll('.active-period').forEach(b=>b.classList.remove('active-period'));
  if(btn) btn.classList.add('active-period');
  const ctx = document.getElementById('analyticsChart');
  if(ctx) {
    const labels = Array.from({length:days},(_,i)=>`Day ${i+1}`);
    const data   = Array.from({length:days},()=>Math.floor(Math.random()*8000+2000));
    drawBarChart(ctx,labels,data,'#8b5cf6','#2563eb');
  }
  // Update stats
  const as = document.getElementById('analyticsStats');
  if(as) {
    const multi = days===7?0.25:days===30?1:3;
    const sts=[
      {label:'Total Revenue',    val:`₹${(48600*multi/1000).toFixed(1)}K`,  icon:'fa-indian-rupee-sign',color:'#10b981',bg:'rgba(16,185,129,0.15)'},
      {label:'New Users',        val:Math.round(124*multi),                  icon:'fa-users',            color:'#2563eb',bg:'rgba(37,99,235,0.15)'},
      {label:'Bookings',         val:Math.round(89*multi),                   icon:'fa-calendar-check',   color:'#8b5cf6',bg:'rgba(139,92,246,0.15)'},
      {label:'Avg Order Value',  val:'₹2,840',                               icon:'fa-chart-line',       color:'#f59e0b',bg:'rgba(245,158,11,0.15)'},
    ];
    as.innerHTML = sts.map(s=>`<div class="stat-card">
      <div class="stat-icon" style="background:${s.bg};color:${s.color};"><i class="fa-solid ${s.icon}"></i></div>
      <div><span class="stat-val" style="color:${s.color};">${s.val}</span><span class="stat-label">${s.label}</span></div>
    </div>`).join('');
  }
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function showSettingsTab(id, btn) {
  document.querySelectorAll('.settings-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(b=>b.classList.remove('active'));
  const tab = document.getElementById(`stab-${id}`);
  if(tab) tab.classList.add('active');
  if(btn) btn.classList.add('active');
}
function saveSettings(section) { toast(`${section.charAt(0).toUpperCase()+section.slice(1)} settings saved.`,'success'); }

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map={pending:'sbadge-yellow',active:'sbadge-blue',completed:'sbadge-green',cancelled:'sbadge-red',approved:'sbadge-green',banned:'sbadge-red'};
  return `<span class="sbadge ${map[status]||'sbadge-gray'}">${status}</span>`;
}

function filterTable(tableId, val) {
  const tbody = document.getElementById(tableId)?.querySelector('tbody');
  if(!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

function exportTableCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if(!table) return;
  const rows  = [...table.querySelectorAll('tr')];
  const csv   = rows.map(r=>[...r.querySelectorAll('th,td')].map(c=>c.textContent.trim().replace(/,/g,'')).join(',')).join('\n');
  const link  = document.createElement('a');
  link.href   = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  link.download= `${filename}_${Date.now()}.csv`;
  link.click();
  toast(`Exported ${filename}.csv`,'success');
}

function globalSearch(val) {
  if(!val) return;
  const lower = val.toLowerCase();
  // Check workers
  if(STORE.workers.some(w=>w.name.toLowerCase().includes(lower))) {
    showSection('workers',null); filterTable('workersTable',val);
  } else if(STORE.users.some(u=>u.name.toLowerCase().includes(lower))) {
    showSection('users',null); filterTable('usersTable',val);
  }
}

function openModal(id) {
  const m = document.getElementById(id);
  if(m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if(m) m.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if(e.target.classList.contains('amodal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Toast
function toast(msg, type='info') {
  const t = document.getElementById('adminToast');
  if(!t) return;
  const colors={info:'#3b82f6',success:'#10b981',warning:'#f59e0b',error:'#ef4444'};
  const icons ={info:'fa-info-circle',success:'fa-check-circle',warning:'fa-exclamation-triangle',error:'fa-times-circle'};
  t.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]};flex-shrink:0;"></i> ${msg}`;
  t.style.borderColor = colors[type]+'44';
  t.style.display = 'flex';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display='none'; }, 3000);
}
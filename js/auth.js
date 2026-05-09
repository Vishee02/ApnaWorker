/* =======================================================
   auth.js — UPDATED with real backend API calls
   Replaces all fake setTimeout() / localStorage logic
   with actual fetch() calls to your Node.js backend
======================================================= */
'use strict';

function initAuthCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const objects = [];
  const mat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.07 });
  [new THREE.IcosahedronGeometry(6), new THREE.OctahedronGeometry(4), new THREE.TorusGeometry(5,1.5,8,20), new THREE.TetrahedronGeometry(4)].forEach((g,i)=>{
    const mesh = new THREE.Mesh(g, mat.clone());
    mesh.position.set((i%2===0?-1:1)*(Math.random()*12+6),(Math.random()-0.5)*12,-15);
    mesh.material.opacity = 0.04+Math.random()*0.06;
    scene.add(mesh); objects.push(mesh);
  });
  const pGeo=new THREE.BufferGeometry(), pPos=new Float32Array(800*3);
  for(let i=0;i<800;i++){pPos[i*3]=(Math.random()-0.5)*50;pPos[i*3+1]=(Math.random()-0.5)*50;pPos[i*3+2]=(Math.random()-0.5)*30;}
  pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x3b82f6,size:0.12,transparent:true,opacity:0.5})));
  camera.position.z=20;
  let frame=0;
  const animate=()=>{requestAnimationFrame(animate);frame++;objects.forEach((o,i)=>{o.rotation.x+=0.003+i*0.001;o.rotation.y+=0.004+i*0.001;o.position.y=Math.sin(frame*0.008+i*1.5)*3;});renderer.render(scene,camera);};
  animate();
  window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
}

/* LOGIN — real API call replacing fake setTimeout */
async function handleLogin(e) {
  e.preventDefault();
  clearErrors();
  const email    = document.getElementById('loginEmail')?.value.trim() || '';
  const password = document.getElementById('loginPassword')?.value || '';
  let valid = true;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('emailError','Please enter a valid email address'); valid=false; }
  if (!password || password.length < 6) { showFieldError('passwordError','Password must be at least 6 characters'); valid=false; }
  if (!valid) return;

  const btn=document.getElementById('loginBtn'), btnText=document.getElementById('loginBtnText');
  if(btn){btn.disabled=true;btn.style.opacity='0.7';}
  if(btnText){btnText.textContent='Signing in...';}

  try {
    // REAL API CALL — sends email+password, gets token back
    const data = await apiLogin(email, password);
    if(typeof showToast==='function') showToast(`Welcome back, ${data.user.name}!`,'success');
    setTimeout(()=>{ window.location.href = data.user.role==='admin'?'admin.html':'dashboard.html'; },800);
  } catch(err) {
    showFieldError('passwordError', err.message||'Login failed. Please try again.');
    if(btn){btn.disabled=false;btn.style.opacity='1';}
    if(btnText){btnText.textContent='Sign In';}
  }
}

/* REGISTER — real API call replacing fake localStorage save */
async function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName')?.value.trim()||'';
  const lastName  = document.getElementById('lastName')?.value.trim() ||'';
  const email     = document.getElementById('regEmail')?.value.trim() ||'';
  const phone     = document.getElementById('phone')?.value.trim()    ||'';
  const password  = document.getElementById('regPassword')?.value     ||'';
  const role      = document.querySelector('.role-option.active')?.dataset.role||'client';
  const skill     = document.getElementById('skill')?.value           ||'';

  if(!firstName||!lastName||!email||!phone||!password){if(typeof showToast==='function')showToast('Please fill in all required fields','error');return;}
  if(password.length<8){if(typeof showToast==='function')showToast('Password must be at least 8 characters','error');return;}

  const btn=e.target.querySelector('button[type="submit"]');
  if(btn){btn.disabled=true;btn.textContent='Creating account...';}

  try {
    // REAL API CALL — creates user in MongoDB
    const data = await apiRegister({ name:`${firstName} ${lastName}`, email, phone, password, role, skill:role==='worker'?skill:undefined });
    if(typeof showToast==='function') showToast('Account created! Redirecting...','success');
    setTimeout(()=>{ window.location.href=data.user.role==='admin'?'admin.html':'dashboard.html'; },1200);
  } catch(err) {
    if(typeof showToast==='function') showToast(err.message||'Registration failed.','error');
    if(btn){btn.disabled=false;btn.textContent='Create My Account';}
  }
}

function selectRole(role,el){document.querySelectorAll('.role-option').forEach(o=>o.classList.remove('active'));el.classList.add('active');const sg=document.getElementById('skillGroup');if(sg)sg.style.display=role==='worker'?'block':'none';}
function togglePassword(inputId,btn){const input=document.getElementById(inputId);if(!input)return;const isPw=input.type==='password';input.type=isPw?'text':'password';const icon=btn.querySelector('i');if(icon)icon.className=isPw?'fa-solid fa-eye-slash':'fa-solid fa-eye';}
function initPasswordStrength(){const pi=document.getElementById('regPassword');if(!pi)return;pi.addEventListener('input',function(){const v=this.value,fill=document.getElementById('strengthFill'),text=document.getElementById('strengthText');if(!fill||!text)return;let s=0;if(v.length>=8)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;const lvls=[{pct:'0%',color:'#ef4444',label:'Too short'},{pct:'25%',color:'#ef4444',label:'Weak'},{pct:'50%',color:'#f59e0b',label:'Fair'},{pct:'75%',color:'#3b82f6',label:'Good'},{pct:'100%',color:'#10b981',label:'Strong'}];const l=lvls[s]||lvls[0];fill.style.width=l.pct;fill.style.background=l.color;text.textContent=l.label;text.style.color=l.color;});}
function showFieldError(id,msg){const el=document.getElementById(id);if(el)el.textContent=msg;}
function clearErrors(){document.querySelectorAll('.form-error').forEach(el=>el.textContent='');}

document.addEventListener('DOMContentLoaded',()=>{
  initPasswordStrength();
  document.querySelectorAll('.form-input').forEach(input=>{
    input.addEventListener('focus',function(){this.closest('.input-wrapper')?.classList.add('focused');});
    input.addEventListener('blur', function(){this.closest('.input-wrapper')?.classList.remove('focused');});
  });
  // Redirect already-logged-in users away from login/register page
  if(typeof isLoggedIn==='function' && isLoggedIn()){
    const user=JSON.parse(localStorage.getItem('apnaworker_user')||'{}');
    window.location.href=user.role==='admin'?'admin.html':'dashboard.html';
  }
});
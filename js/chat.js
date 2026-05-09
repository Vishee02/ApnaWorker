/* ===== CHAT.JS ===== */
'use strict';

const CONVERSATIONS = [
  { id:1, name:'Rajesh Kumar',  avatar:'RK', color:'#2563eb', online:true,  lastMsg:'I will arrive by 10 AM tomorrow.', time:'10:32 AM', unread:2, skill:'Electrician' },
  { id:2, name:'Priya Sharma',  avatar:'PS', color:'#8b5cf6', online:true,  lastMsg:'The website is almost done!',      time:'Yesterday', unread:0, skill:'Developer' },
  { id:3, name:'Suresh Patel',  avatar:'SP', color:'#06b6d4', online:false, lastMsg:'Thanks for the great review!',     time:'Mon',       unread:0, skill:'Plumber' },
  { id:4, name:'Vikram Singh',  avatar:'VS', color:'#ec4899', online:false, lastMsg:'What colors do you prefer?',       time:'Sun',       unread:1, skill:'Painter' },
  { id:5, name:'Neha Gupta',    avatar:'NG', color:'#f97316', online:true,  lastMsg:'Sending the design files now.',    time:'Sat',       unread:0, skill:'Designer' },
];

const MESSAGES_DB = {
  1: [
    { id:1, from:'them', text:'Hello! I received your booking for electrical repair.', time:'10:00 AM' },
    { id:2, from:'me',   text:'Hi Rajesh! Yes, I need my switchboard fixed and 2 fans installed.', time:'10:05 AM' },
    { id:3, from:'them', text:'No problem. I will bring all the materials needed.', time:'10:15 AM' },
    { id:4, from:'them', text:'What time works best for you?', time:'10:16 AM' },
    { id:5, from:'me',   text:'Morning works best. Around 10 AM?', time:'10:20 AM' },
    { id:6, from:'them', text:'Perfect! I will arrive by 10 AM tomorrow.', time:'10:32 AM' },
  ],
  2: [
    { id:1, from:'me',   text:'Hi Priya, how is the website coming along?', time:'Yesterday 3:00 PM' },
    { id:2, from:'them', text:'Going great! Just finishing the dashboard.', time:'Yesterday 3:15 PM' },
    { id:3, from:'them', text:'The website is almost done!', time:'Yesterday 5:30 PM' },
  ],
};

let activeConversationId = 1;
let typingTimer;

// ── RENDER CONVERSATIONS ──────────────────────────────────────────────────────
function renderConversations(filter = '') {
  const list = document.getElementById('conversationsList');
  if (!list) return;

  const filtered = CONVERSATIONS.filter(c =>
    !filter || c.name.toLowerCase().includes(filter.toLowerCase()) || c.skill.toLowerCase().includes(filter.toLowerCase())
  );

  list.innerHTML = filtered.map(c => `
    <div class="conversation-item ${c.id === activeConversationId ? 'active' : ''}"
         onclick="openConversation(${c.id})" id="conv-${c.id}">
      <div class="conv-avatar" style="background:linear-gradient(135deg,${c.color},${c.color}99);">
        ${c.avatar}
        ${c.online ? '<div class="online-dot-conv"></div>' : ''}
      </div>
      <div class="conv-info">
        <div class="conv-name">${c.name}</div>
        <div class="conv-preview">${c.lastMsg}</div>
      </div>
      <div class="conv-meta">
        <span class="conv-time">${c.time}</span>
        ${c.unread > 0 ? `<span class="conv-unread">${c.unread}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// ── OPEN CONVERSATION ─────────────────────────────────────────────────────────
function openConversation(id) {
  activeConversationId = id;
  const conv = CONVERSATIONS.find(c => c.id === id);
  if (!conv) return;

  // Update header
  document.getElementById('chatUserName').textContent      = conv.name;
  document.getElementById('chatAvatarHeader').textContent  = conv.avatar;
  document.getElementById('chatAvatarHeader').style.background = `linear-gradient(135deg,${conv.color},${conv.color}99)`;
  document.getElementById('onlineStatus').innerHTML        = conv.online
    ? `<span class="online-dot"></span> Online`
    : '<span style="color:var(--text-muted)">Offline</span>';

  // Info panel
  if (document.getElementById('infoPanelAvatar')) {
    document.getElementById('infoPanelAvatar').textContent = conv.avatar;
    document.getElementById('infoPanelAvatar').style.background = `linear-gradient(135deg,${conv.color},${conv.color}99)`;
  }
  if (document.getElementById('infoPanelName')) document.getElementById('infoPanelName').textContent = conv.name;

  // Mark unread = 0
  conv.unread = 0;

  // Render messages
  renderMessages(id);
  renderConversations();
}

// ── RENDER MESSAGES ───────────────────────────────────────────────────────────
function renderMessages(convId) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const messages = MESSAGES_DB[convId] || [];
  container.innerHTML = '';

  // Date divider
  container.insertAdjacentHTML('beforeend', `<div class="chat-date-divider">Today</div>`);

  // Group consecutive messages from same sender
  let lastFrom = null;
  let group;
  messages.forEach(msg => {
    if (msg.from !== lastFrom) {
      group = document.createElement('div');
      group.className = `message-group ${msg.from === 'me' ? 'sent' : 'received'}`;
      container.appendChild(group);
      lastFrom = msg.from;
    }
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = msg.text;
    const timeEl = document.createElement('div');
    timeEl.className = 'message-time';
    timeEl.textContent = msg.time;
    group.appendChild(bubble);
    group.appendChild(timeEl);
  });

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// ── SEND MESSAGE ──────────────────────────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('messageInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  // Add to DB
  if (!MESSAGES_DB[activeConversationId]) MESSAGES_DB[activeConversationId] = [];
  const newMsg = { id: Date.now(), from:'me', text, time: formatTime(new Date()) };
  MESSAGES_DB[activeConversationId].push(newMsg);

  // Update last message in conversation
  const conv = CONVERSATIONS.find(c => c.id === activeConversationId);
  if (conv) conv.lastMsg = text;

  // Re-render
  renderMessages(activeConversationId);
  renderConversations();
  input.value = '';

  // Simulate typing + reply after delay
  simulateReply();
}

function simulateReply() {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'message-group received';
  typing.id = 'typingIndicator';
  typing.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  // Remove and add real reply
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();

    const replies = [
      'Got it! I will take care of that.',
      'Understood, thanks for letting me know.',
      'Sure, I will get back to you shortly.',
      'Thanks! Will confirm the details soon.',
      'Perfect, see you then!',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    if (!MESSAGES_DB[activeConversationId]) MESSAGES_DB[activeConversationId] = [];
    MESSAGES_DB[activeConversationId].push({ id: Date.now(), from:'them', text: reply, time: formatTime(new Date()) });

    const conv = CONVERSATIONS.find(c => c.id === activeConversationId);
    if (conv) conv.lastMsg = reply;

    renderMessages(activeConversationId);
    renderConversations();
  }, 1500 + Math.random() * 1000);
}

// ── UTILITIES ─────────────────────────────────────────────────────────────────
function formatTime(d) {
  return d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
}

function filterConversations(val) { renderConversations(val); }

function handleFileAttachment(input) {
  const file = input.files[0];
  if (!file) return;
  if (typeof showToast === 'function') showToast(`File "${file.name}" attached (not uploaded in demo)`, 'info');
  input.value = '';
}

function shareLocation() {
  if (typeof showToast === 'function') showToast('Location sharing requires device GPS permissions', 'info');
}

function sendFile() { document.getElementById('fileInput')?.click(); }

function blockUser() {
  if (confirm('Are you sure you want to block this user?')) {
    if (typeof showToast === 'function') showToast('User blocked successfully', 'success');
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderConversations();
  openConversation(1);

  // Emoji button placeholder
  document.querySelector('.icon-btn[title="Emoji"]')?.addEventListener('click', () => {
    if (typeof showToast === 'function') showToast('Emoji picker coming soon!', 'info');
  });
});
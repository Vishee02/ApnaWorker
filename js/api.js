/* =======================================================
   api.js — ApnaWorker Frontend ↔ Backend Connector
   
   HOW THIS WORKS:
   Every time the frontend needs real data (login, workers,
   bookings, chat) it calls a function from this file.
   This file sends the request to your backend server
   and returns the response.

   ADD THIS SCRIPT TO EVERY HTML PAGE:
   <script src="js/api.js"></script>
   Put it BEFORE all other <script> tags.
======================================================= */

'use strict';

/* -------------------------------------------------------
   STEP 1: SET YOUR BACKEND URL
   
   This is the address of your running backend server.
   
   - Local development (your computer):
     const API_BASE = 'http://localhost:5000/api';
   
   - After deploying to Coolify:
     const API_BASE = 'https://your-coolify-url.com/api';
   
   Because your backend already serves the frontend too
   (server.js line: app.use(express.static(...))),
   you can use an empty string '' which means
   "same server, same domain" — this works everywhere
   automatically without changing anything on deploy.
------------------------------------------------------- */
const API_BASE = '';   // ← Leave this empty. Works locally AND on Coolify.

/* -------------------------------------------------------
   STEP 2: TOKEN STORAGE
   
   After login, the backend gives us a JWT token.
   We save it here so every future request can use it.
   localStorage = survives page refresh and browser close.
------------------------------------------------------- */
function getToken() {
  return localStorage.getItem('aw_token');
}

function saveToken(token) {
  localStorage.setItem('aw_token', token);
}

function removeToken() {
  localStorage.removeItem('aw_token');
  localStorage.removeItem('apnaworker_user');
}

function isLoggedIn() {
  return !!getToken();
}

/* -------------------------------------------------------
   STEP 3: CORE FETCH FUNCTION
   
   All API calls go through this single function.
   It automatically:
   - Adds /api to the URL
   - Adds the JWT token to the request header
   - Converts the response to JSON
   - Shows error messages if something fails
------------------------------------------------------- */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  // Build request headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If user is logged in, attach their token to every request
  // The backend reads this to know WHO is making the request
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // If server returned an error (4xx or 5xx), throw it
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data;

  } catch (err) {
    // Network error (server is down, no internet, wrong URL)
    if (err.message === 'Failed to fetch') {
      console.error('❌ Cannot reach backend server. Is it running?');
      if (typeof showToast === 'function') {
        showToast('Cannot connect to server. Please try again.', 'error');
      }
    }
    throw err; // Re-throw so the calling function can handle it
  }
}

/* =======================================================
   AUTH API FUNCTIONS
   These replace the fake setTimeout() code in auth.js
======================================================= */

// LOGIN — sends email + password, gets back a JWT token
async function apiLogin(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Save token and user info to localStorage
  saveToken(data.token);
  localStorage.setItem('apnaworker_user', JSON.stringify(data.user));

  return data;
}

// REGISTER — creates a new account
async function apiRegister(userData) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  saveToken(data.token);
  localStorage.setItem('apnaworker_user', JSON.stringify(data.user));

  return data;
}

// GET CURRENT USER — checks who is logged in
async function apiGetMe() {
  return await apiFetch('/auth/me');
}

// LOGOUT — removes token, sends user to login page
function apiLogout() {
  removeToken();
  window.location.href = 'login.html';
}

/* =======================================================
   WORKERS API FUNCTIONS
   These replace the hardcoded WORKERS array in app.js
======================================================= */

// GET ALL WORKERS — with optional filters
// Example: apiGetWorkers({ category:'electrician', city:'Varanasi', sort:'rating' })
async function apiGetWorkers(filters = {}) {
  // Convert filters object to URL query string
  // e.g. { category:'electrician', city:'Varanasi' }
  // becomes ?category=electrician&city=Varanasi
  const query = new URLSearchParams(filters).toString();
  const endpoint = query ? `/workers?${query}` : '/workers';
  return await apiFetch(endpoint);
}

// GET ONE WORKER — by their ID
async function apiGetWorker(id) {
  return await apiFetch(`/workers/${id}`);
}

// SEARCH WORKERS — by keyword and city
async function apiSearch(query, city = '') {
  const params = new URLSearchParams({ q: query });
  if (city) params.append('city', city);
  return await apiFetch(`/search?${params.toString()}`);
}

/* =======================================================
   BOOKING API FUNCTIONS
   These replace the fake localStorage booking in booking.js
======================================================= */

// CREATE BOOKING — sends booking details to backend
async function apiCreateBooking(bookingData) {
  return await apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
}

// GET MY BOOKINGS — for the logged-in client
async function apiGetMyBookings() {
  return await apiFetch('/bookings/my');
}

// GET WORKER BOOKINGS — for the logged-in worker
async function apiGetWorkerBookings() {
  return await apiFetch('/bookings/worker');
}

// UPDATE BOOKING STATUS — e.g. cancel a booking
async function apiUpdateBookingStatus(bookingId, status, cancelReason = '') {
  return await apiFetch(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, cancelReason }),
  });
}

/* =======================================================
   CATEGORIES API FUNCTIONS
   These replace the hardcoded CATEGORIES array in app.js
======================================================= */

// GET ALL CATEGORIES — from the database
async function apiGetCategories() {
  return await apiFetch('/categories');
}

/* =======================================================
   CHAT API FUNCTIONS
   These replace the hardcoded CONVERSATIONS in chat.js
======================================================= */

// GET ALL CONVERSATIONS
async function apiGetConversations() {
  return await apiFetch('/chat/conversations');
}

// GET MESSAGES IN A CONVERSATION
async function apiGetMessages(conversationId) {
  return await apiFetch(`/chat/${conversationId}`);
}

// SEND A TEXT MESSAGE
async function apiSendMessage(receiverId, text) {
  return await apiFetch('/chat/send', {
    method: 'POST',
    body: JSON.stringify({ receiverId, text }),
  });
}

/* =======================================================
   REVIEW API FUNCTIONS
======================================================= */

// SUBMIT A REVIEW after a completed booking
async function apiSubmitReview(reviewData) {
  return await apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

// GET REVIEWS FOR A WORKER
async function apiGetWorkerReviews(workerId) {
  return await apiFetch(`/reviews/worker/${workerId}`);
}

/* =======================================================
   NOTIFICATION API FUNCTIONS
======================================================= */

// GET MY NOTIFICATIONS
async function apiGetNotifications() {
  return await apiFetch('/notifications');
}

// MARK ALL AS READ
async function apiMarkAllRead() {
  return await apiFetch('/notifications/read-all', { method: 'PATCH' });
}

/* =======================================================
   COUPON API FUNCTIONS
======================================================= */

// VALIDATE A COUPON CODE before applying it
async function apiValidateCoupon(code, amount) {
  return await apiFetch('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, amount }),
  });
}

/* =======================================================
   CITIES API FUNCTIONS
======================================================= */

// GET ALL ACTIVE CITIES
async function apiGetCities() {
  return await apiFetch('/cities');
}

/* =======================================================
   PAYMENT API FUNCTIONS (Razorpay)
======================================================= */

// CREATE RAZORPAY ORDER — get an order ID from backend
async function apiCreatePaymentOrder(amount, bookingId) {
  return await apiFetch('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount, bookingId }),
  });
}

// VERIFY PAYMENT — after Razorpay window closes
async function apiVerifyPayment(paymentData) {
  return await apiFetch('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

/* =======================================================
   HEALTH CHECK — test if backend is reachable
======================================================= */
async function apiHealthCheck() {
  try {
    const data = await apiFetch('/health');
    console.log('✅ Backend connected:', data);
    return true;
  } catch {
    console.error('❌ Backend not reachable');
    return false;
  }
}

// Run health check automatically when page loads (shows in browser console)
document.addEventListener('DOMContentLoaded', () => {
  apiHealthCheck();
});
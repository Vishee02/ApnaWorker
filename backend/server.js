/* ============================================================
   APNAWORKER — PRODUCTION BACKEND SERVER
   Node.js + Express + MongoDB + JWT + Socket.io
   ============================================================ */
'use strict';

const express      = require('express');
const http         = require('http');
const { Server }   = require('socket.io');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const compression  = require('compression');
const morgan       = require('morgan');
const path         = require('path');
require('dotenv').config();

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET','POST'] }
});

/* ── SECURITY MIDDLEWARE ───────────────────────────────────── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

/* ── RATE LIMITING ─────────────────────────────────────────── */
const generalLimiter = rateLimit({ windowMs:15*60*1000, max:200, message:{ error:'Too many requests. Please try again later.' }});
const authLimiter    = rateLimit({ windowMs:15*60*1000, max:20,  message:{ error:'Too many auth attempts.' }});
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

/* ── BODY PARSING ──────────────────────────────────────────── */
app.use(express.json({ limit:'10mb' }));
app.use(express.urlencoded({ extended:true, limit:'10mb' }));

/* ── STATIC FILES (serve frontend) ────────────────────────── */
app.use(express.static(path.join(__dirname, '..')));

/* ── MONGODB CONNECTION ────────────────────────────────────── */
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apnaworker', {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected successfully');
  seedDatabase();
}).catch(err => console.error('❌ MongoDB connection error:', err));

/* ── MONGOOSE SCHEMAS ──────────────────────────────────────── */
const { Schema, model, models } = mongoose;

// User Schema
const userSchema = new Schema({
  name:        { type:String, required:true, trim:true },
  email:       { type:String, required:true, unique:true, lowercase:true, trim:true },
  password:    { type:String, required:true, minlength:6 },
  phone:       { type:String, trim:true },
  role:        { type:String, enum:['client','worker','admin'], default:'client' },
  city:        { type:String, trim:true },
  avatar:      { type:String, default:'' },
  isVerified:  { type:Boolean, default:false },
  isBanned:    { type:Boolean, default:false },
  savedWorkers:[ { type:Schema.Types.ObjectId, ref:'Worker' } ],
  wallet:      { type:Number, default:0 },
  createdAt:   { type:Date, default:Date.now }
}, { timestamps:true });

// Worker Schema
const workerSchema = new Schema({
  userId:      { type:Schema.Types.ObjectId, ref:'User' },
  name:        { type:String, required:true },
  email:       { type:String, required:true, unique:true, lowercase:true },
  phone:       { type:String },
  skill:       { type:String, required:true },
  category:    { type:String, required:true },
  bio:         { type:String, default:'' },
  location:    { type:String },
  city:        { type:String },
  avatar:      { type:String, default:'' },
  images:      [String],
  tags:        [String],
  rating:      { type:Number, default:0, min:0, max:5 },
  reviewCount: { type:Number, default:0 },
  jobsDone:    { type:Number, default:0 },
  hourlyRate:  { type:Number, default:500 },
  isVerified:  { type:Boolean, default:false },
  isAvailable: { type:Boolean, default:true },
  status:      { type:String, enum:['pending','approved','banned'], default:'pending' },
  earnings:    { type:Number, default:0 },
  experience:  { type:Number, default:0 },
  kyc: {
    aadhar:    { type:String, default:'' },
    pan:       { type:String, default:'' },
    status:    { type:String, enum:['not_submitted','pending','verified'], default:'not_submitted' }
  }
}, { timestamps:true });

// Category Schema
const categorySchema = new Schema({
  name:       { type:String, required:true, unique:true },
  icon:       { type:String, default:'🔧' },
  color:      { type:String, default:'#2563eb' },
  description:{ type:String, default:'' },
  isActive:   { type:Boolean, default:true },
  workerCount:{ type:Number, default:0 },
  sortOrder:  { type:Number, default:0 }
}, { timestamps:true });

// Booking Schema
const bookingSchema = new Schema({
  bookingId:   { type:String, unique:true },
  client:      { type:Schema.Types.ObjectId, ref:'User', required:true },
  worker:      { type:Schema.Types.ObjectId, ref:'Worker', required:true },
  service:     { type:String, required:true },
  category:    { type:String, required:true },
  description: { type:String },
  address:     { type:String },
  city:        { type:String },
  scheduledDate:{ type:Date, required:true },
  scheduledTime:{ type:String },
  status:      { type:String, enum:['pending','confirmed','active','completed','cancelled'], default:'pending' },
  amount:      { type:Number, required:true },
  platformFee: { type:Number, default:0 },
  tax:         { type:Number, default:0 },
  totalAmount: { type:Number, required:true },
  paymentStatus:{ type:String, enum:['pending','paid','refunded'], default:'pending' },
  paymentMethod:{ type:String, default:'online' },
  razorpayOrderId:{ type:String },
  razorpayPaymentId:{ type:String },
  notes:       { type:String },
  cancelReason:{ type:String },
  completedAt: { type:Date }
}, { timestamps:true });

// Message / Chat Schema
const messageSchema = new Schema({
  conversationId:{ type:String, required:true },
  sender:        { type:Schema.Types.ObjectId, ref:'User', required:true },
  receiver:      { type:Schema.Types.ObjectId, ref:'User', required:true },
  text:          { type:String },
  image:         { type:String },
  type:          { type:String, enum:['text','image','file','location'], default:'text' },
  seen:          { type:Boolean, default:false },
  seenAt:        { type:Date }
}, { timestamps:true });

// Review Schema
const reviewSchema = new Schema({
  booking:   { type:Schema.Types.ObjectId, ref:'Booking', required:true },
  reviewer:  { type:Schema.Types.ObjectId, ref:'User',    required:true },
  worker:    { type:Schema.Types.ObjectId, ref:'Worker',  required:true },
  rating:    { type:Number, required:true, min:1, max:5 },
  title:     { type:String },
  comment:   { type:String, required:true },
  images:    [String],
  isPublished:{ type:Boolean, default:false },
  adminNote: { type:String }
}, { timestamps:true });

// Payment Schema
const paymentSchema = new Schema({
  booking:        { type:Schema.Types.ObjectId, ref:'Booking' },
  user:           { type:Schema.Types.ObjectId, ref:'User' },
  worker:         { type:Schema.Types.ObjectId, ref:'Worker' },
  amount:         { type:Number, required:true },
  currency:       { type:String, default:'INR' },
  method:         { type:String },
  razorpayOrderId:{ type:String },
  razorpayPaymentId:{ type:String },
  status:         { type:String, enum:['pending','success','failed','refunded'], default:'pending' },
  refundReason:   { type:String }
}, { timestamps:true });

// Notification Schema
const notificationSchema = new Schema({
  user:     { type:Schema.Types.ObjectId, ref:'User' },
  title:    { type:String, required:true },
  message:  { type:String, required:true },
  type:     { type:String, enum:['booking','payment','review','system','promo'], default:'system' },
  isRead:   { type:Boolean, default:false },
  link:     { type:String, default:'' }
}, { timestamps:true });

// Coupon Schema
const couponSchema = new Schema({
  code:       { type:String, required:true, unique:true, uppercase:true },
  type:       { type:String, enum:['percent','flat'], default:'percent' },
  value:      { type:Number, required:true },
  minOrder:   { type:Number, default:0 },
  maxUses:    { type:Number, default:100 },
  usedCount:  { type:Number, default:0 },
  expiresAt:  { type:Date },
  isActive:   { type:Boolean, default:true }
}, { timestamps:true });

// City Schema
const citySchema = new Schema({
  name:      { type:String, required:true },
  state:     { type:String },
  isActive:  { type:Boolean, default:true },
  workerCount:{ type:Number, default:0 }
}, { timestamps:true });

// Register models
const User         = models.User         || model('User',         userSchema);
const Worker       = models.Worker       || model('Worker',       workerSchema);
const Category     = models.Category     || model('Category',     categorySchema);
const Booking      = models.Booking      || model('Booking',      bookingSchema);
const Message      = models.Message      || model('Message',      messageSchema);
const Review       = models.Review       || model('Review',       reviewSchema);
const Payment      = models.Payment      || model('Payment',      paymentSchema);
const Notification = models.Notification || model('Notification', notificationSchema);
const Coupon       = models.Coupon       || model('Coupon',       couponSchema);
const City         = models.City         || model('City',         citySchema);

/* ── JWT & AUTH HELPERS ────────────────────────────────────── */
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET  = process.env.JWT_SECRET  || 'apnaworker_super_secret_jwt_2025';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = verifyToken(header.split(' ')[1]);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function generateBookingId() {
  return 'BK' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
}

/* ── CLOUDINARY SETUP ──────────────────────────────────────── */
const cloudinary = require('cloudinary').v2;
const multer     = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'apnaworker', allowed_formats: ['jpg','jpeg','png','webp'], transformation:[{ width:800, crop:'limit', quality:'auto' }] }
});
const upload = multer({ storage, limits:{ fileSize:5*1024*1024 } });

/* ══════════════════════════════════════════════════════════════
   API ROUTES
══════════════════════════════════════════════════════════════ */

/* ── AUTH ROUTES ───────────────────────────────────────────── */
const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, city, skill } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name, email, password:hashed, phone, role:role||'client', city });

    // If registering as worker, create worker profile
    if (role === 'worker' && skill) {
      await Worker.create({ userId:user._id, name, email, phone, skill, category:skill.toLowerCase(), city, status:'pending' });
    }

    const token = signToken({ id:user._id, email:user.email, role:user.role, name:user.name });
    res.status(201).json({ message:'Account created successfully', token, user:{ id:user._id, name, email, role:user.role, city } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ error: 'Your account has been suspended. Contact support.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id:user._id, email:user.email, role:user.role, name:user.name });
    res.json({ message:'Login successful', token, user:{ id:user._id, name:user.name, email:user.email, role:user.role, city:user.city, avatar:user.avatar } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/auth/update-profile
authRouter.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, city }, { new:true, select:'-password' });
    res.json({ message:'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/change-password
authRouter.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message:'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/api/auth', authRouter);

/* ── WORKER ROUTES ─────────────────────────────────────────── */
const workerRouter = express.Router();

// GET /api/workers — list with filters
workerRouter.get('/', async (req, res) => {
  try {
    const { category, city, rating, minPrice, maxPrice, search, sort='rating', page=1, limit=12 } = req.query;
    const filter = { status:'approved' };
    if (category)                   filter.category = category;
    if (city)                       filter.city     = new RegExp(city, 'i');
    if (rating)                     filter.rating   = { $gte: parseFloat(rating) };
    if (minPrice || maxPrice)       filter.hourlyRate = {};
    if (minPrice)                   filter.hourlyRate.$gte = parseInt(minPrice);
    if (maxPrice)                   filter.hourlyRate.$lte = parseInt(maxPrice);
    if (search)                     filter.$or = [{ name:new RegExp(search,'i') }, { skill:new RegExp(search,'i') }, { tags:new RegExp(search,'i') }];

    const sortMap = { rating:{ rating:-1 }, price_low:{ hourlyRate:1 }, price_high:{ hourlyRate:-1 }, jobs:{ jobsDone:-1 } };
    const sortObj = sortMap[sort] || { rating:-1 };
    const skip    = (parseInt(page)-1) * parseInt(limit);
    const total   = await Worker.countDocuments(filter);
    const workers = await Worker.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit));
    res.json({ workers, total, page:parseInt(page), pages:Math.ceil(total/parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/workers/:id
workerRouter.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker || worker.status !== 'approved') return res.status(404).json({ error: 'Worker not found' });
    const reviews = await Review.find({ worker:worker._id, isPublished:true }).populate('reviewer','name avatar').sort('-createdAt').limit(10);
    res.json({ worker, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/workers/:id — update own profile
workerRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    if (worker.userId?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const { bio, tags, hourlyRate, isAvailable, location, city, experience } = req.body;
    Object.assign(worker, { bio, tags, hourlyRate, isAvailable, location, city, experience });
    await worker.save();
    res.json({ message:'Profile updated', worker });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/workers/:id/upload-image
workerRouter.post('/:id/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    if (req.file) {
      worker.avatar = req.file.path;
      await worker.save();
    }
    res.json({ message:'Image uploaded', avatar:worker.avatar });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.use('/api/workers', workerRouter);

/* ── BOOKING ROUTES ────────────────────────────────────────── */
const bookingRouter = express.Router();

// POST /api/bookings
bookingRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { workerId, service, category, description, address, city, scheduledDate, scheduledTime, amount, couponCode } = req.body;
    if (!workerId || !service || !scheduledDate || !amount) {
      return res.status(400).json({ error: 'Worker, service, date, and amount are required' });
    }
    const worker = await Worker.findById(workerId);
    if (!worker || worker.status !== 'approved') return res.status(404).json({ error: 'Worker not found' });

    let finalAmount = parseFloat(amount);
    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code:couponCode.toUpperCase(), isActive:true, expiresAt:{ $gt:new Date() } });
      if (coupon && coupon.usedCount < coupon.maxUses && finalAmount >= coupon.minOrder) {
        if (coupon.type === 'percent') finalAmount -= finalAmount * coupon.value / 100;
        else finalAmount -= coupon.value;
        coupon.usedCount++; await coupon.save();
      }
    }

    const platformFee  = Math.round(finalAmount * 0.05);
    const tax          = Math.round(finalAmount * 0.18);
    const totalAmount  = Math.round(finalAmount + platformFee + tax);
    const bookingId    = generateBookingId();

    const booking = await Booking.create({
      bookingId, client:req.user.id, worker:workerId, service, category,
      description, address, city, scheduledDate, scheduledTime,
      amount:finalAmount, platformFee, tax, totalAmount
    });

    // Create notification for worker
    await Notification.create({ user:worker.userId, title:'New Booking!', message:`You have a new booking for ${service} on ${scheduledDate}.`, type:'booking', link:`/booking.html` });

    res.status(201).json({ message:'Booking created', booking, bookingId, totalAmount });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/my — client's bookings
bookingRouter.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ client:req.user.id }).populate('worker','name skill avatar phone').sort('-createdAt');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/worker — worker's bookings
bookingRouter.get('/worker', authMiddleware, async (req, res) => {
  try {
    const worker   = await Worker.findOne({ userId:req.user.id });
    if (!worker) return res.status(404).json({ error: 'Worker profile not found' });
    const bookings = await Booking.find({ worker:worker._id }).populate('client','name phone avatar city').sort('-createdAt');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/bookings/:id/status
bookingRouter.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const allowed = ['pending','confirmed','active','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    booking.status = status;
    if (cancelReason) booking.cancelReason = cancelReason;
    if (status === 'completed') {
      booking.completedAt = new Date();
      // Update worker job count
      await Worker.findByIdAndUpdate(booking.worker, { $inc:{ jobsDone:1, earnings:booking.amount } });
    }
    await booking.save();

    // Notify client
    const notifMsg = `Your booking ${booking.bookingId} status updated to: ${status}`;
    await Notification.create({ user:booking.client, title:'Booking Update', message:notifMsg, type:'booking' });

    // Socket emit
    io.to(`user_${booking.client}`).emit('booking_update', { bookingId:booking.bookingId, status });
    res.json({ message:'Status updated', booking });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.use('/api/bookings', bookingRouter);

/* ── CATEGORY ROUTES ───────────────────────────────────────── */
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive:true }).sort('sortOrder');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/categories', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, icon, color, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const cat = await Category.create({ name, icon, color, description });
    res.status(201).json({ message:'Category created', category:cat });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/categories/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ message:'Category updated', category:cat });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/categories/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message:'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── CHAT / MESSAGE ROUTES ─────────────────────────────────── */
const chatRouter = express.Router();

chatRouter.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const convos = await Message.aggregate([
      { $match:{ $or:[{ sender:new mongoose.Types.ObjectId(userId) },{ receiver:new mongoose.Types.ObjectId(userId) }] } },
      { $sort:{ createdAt:-1 } },
      { $group:{ _id:'$conversationId', lastMessage:{ $first:'$$ROOT' }, unread:{ $sum:{ $cond:[{ $and:[{ $eq:['$receiver', new mongoose.Types.ObjectId(userId)] },{ $eq:['$seen',false] }] },1,0] } } } },
      { $sort:{ 'lastMessage.createdAt':-1 } },
      { $limit: 30 }
    ]);
    res.json({ conversations: convos });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

chatRouter.get('/:conversationId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId:req.params.conversationId })
      .populate('sender','name avatar')
      .sort('createdAt')
      .limit(100);
    await Message.updateMany({ conversationId:req.params.conversationId, receiver:req.user.id, seen:false }, { seen:true, seenAt:new Date() });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

chatRouter.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, text, type } = req.body;
    const senderId = req.user.id;
    const ids      = [senderId, receiverId].sort();
    const convoId  = `conv_${ids[0]}_${ids[1]}`;

    const msg = await Message.create({ conversationId:convoId, sender:senderId, receiver:receiverId, text, type:'text' });
    await msg.populate('sender','name avatar');

    // Real-time delivery
    io.to(`user_${receiverId}`).emit('new_message', msg);
    res.status(201).json({ message:'Sent', msg });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

chatRouter.post('/send-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const senderId = req.user.id;
    const ids      = [senderId, receiverId].sort();
    const convoId  = `conv_${ids[0]}_${ids[1]}`;

    const msg = await Message.create({ conversationId:convoId, sender:senderId, receiver:receiverId, image:req.file.path, type:'image' });
    await msg.populate('sender','name avatar');
    io.to(`user_${receiverId}`).emit('new_message', msg);
    res.status(201).json({ message:'Image sent', msg });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.use('/api/chat', chatRouter);

/* ── REVIEW ROUTES ─────────────────────────────────────────── */
app.post('/api/reviews', authMiddleware, async (req, res) => {
  try {
    const { bookingId, workerId, rating, comment, title } = req.body;
    if (!bookingId || !workerId || !rating || !comment) return res.status(400).json({ error: 'All fields required' });
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.client.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (booking.status !== 'completed') return res.status(400).json({ error: 'Can only review completed bookings' });

    const review = await Review.create({ booking:bookingId, reviewer:req.user.id, worker:workerId, rating, comment, title });

    // Update worker average rating
    const all = await Review.find({ worker:workerId, isPublished:true });
    const avg = all.length ? all.reduce((s,r)=>s+r.rating,0)/all.length : rating;
    await Worker.findByIdAndUpdate(workerId, { rating:Math.round(avg*10)/10, reviewCount:all.length });
    res.status(201).json({ message:'Review submitted for moderation', review });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/reviews/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker:req.params.workerId, isPublished:true })
      .populate('reviewer','name avatar')
      .sort('-createdAt')
      .limit(20);
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── PAYMENT ROUTES (Razorpay) ─────────────────────────────── */
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

app.post('/api/payments/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  bookingId,
      notes:    { bookingId }
    });
    res.json({ orderId:order.id, amount:order.amount, currency:order.currency, key:process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

app.post('/api/payments/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;
    const sign   = razorpayOrderId + '|' + razorpayPaymentId;
    const digest = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder').update(sign).digest('hex');
    if (digest !== razorpaySignature) return res.status(400).json({ error: 'Payment verification failed' });

    await Booking.findByIdAndUpdate(bookingId, { paymentStatus:'paid', status:'confirmed', razorpayOrderId, razorpayPaymentId });
    await Payment.create({ booking:bookingId, user:req.user.id, amount:req.body.amount, method:'razorpay', razorpayOrderId, razorpayPaymentId, status:'success' });

    res.json({ message:'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Verification error' });
  }
});

/* ── COUPON ROUTES ─────────────────────────────────────────── */
app.post('/api/coupons/validate', authMiddleware, async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code:code.toUpperCase(), isActive:true });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ error: 'Coupon expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (amount < coupon.minOrder) return res.status(400).json({ error: `Minimum order ₹${coupon.minOrder} required` });

    const discount = coupon.type === 'percent' ? Math.round(amount * coupon.value / 100) : coupon.value;
    res.json({ valid:true, discount, coupon:{ code:coupon.code, type:coupon.type, value:coupon.value } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── NOTIFICATION ROUTES ───────────────────────────────────── */
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const notifs = await Notification.find({ user:req.user.id }).sort('-createdAt').limit(30);
    const unread = await Notification.countDocuments({ user:req.user.id, isRead:false });
    res.json({ notifications:notifs, unread });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead:true });
    res.json({ message:'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/notifications/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ user:req.user.id, isRead:false }, { isRead:true });
    res.json({ message:'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── UPLOAD ROUTES ─────────────────────────────────────────── */
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url:req.file.path, public_id:req.file.filename });
});

/* ── CITY ROUTES ───────────────────────────────────────────── */
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find({ isActive:true }).sort('name');
    res.json({ cities });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── ADMIN ROUTES ──────────────────────────────────────────── */
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminMiddleware);

// Dashboard stats
adminRouter.get('/stats', async (req, res) => {
  try {
    const [users, workers, bookings, payments] = await Promise.all([
      User.countDocuments({ role:'client' }),
      Worker.countDocuments({ status:'approved' }),
      Booking.countDocuments(),
      Payment.aggregate([{ $match:{ status:'success' } },{ $group:{ _id:null, total:{ $sum:'$amount' } } }])
    ]);
    const revenue = payments[0]?.total || 0;
    res.json({ users, workers, bookings, revenue, pendingWorkers:await Worker.countDocuments({ status:'pending' }) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Users
adminRouter.get('/users',         async (req,res) => { try { const users=await User.find().select('-password').sort('-createdAt'); res.json({users}); } catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/users/:id/ban',async (req,res) => { try { const u=await User.findById(req.params.id); if(!u) return res.status(404).json({error:'Not found'}); u.isBanned=!u.isBanned; await u.save(); res.json({message:`User ${u.isBanned?'banned':'unbanned'}`,isBanned:u.isBanned}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.delete('/users/:id',   async (req,res) => { try { await User.findByIdAndDelete(req.params.id); res.json({message:'User deleted'}); }catch{ res.status(500).json({error:'Server error'}); }});

// Workers
adminRouter.get('/workers',                 async (req,res) => { try { const ws=await Worker.find().sort('-createdAt'); res.json({workers:ws}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/workers/:id/approve',   async (req,res) => { try { const w=await Worker.findByIdAndUpdate(req.params.id,{status:'approved',isVerified:true},{new:true}); res.json({message:'Worker approved',worker:w}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/workers/:id/ban',       async (req,res) => { try { const w=await Worker.findById(req.params.id); if(!w) return res.status(404).json({error:'Not found'}); w.status=w.status==='banned'?'approved':'banned'; await w.save(); res.json({message:`Worker ${w.status}`,worker:w}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.delete('/workers/:id',          async (req,res) => { try { await Worker.findByIdAndDelete(req.params.id); res.json({message:'Worker deleted'}); }catch{ res.status(500).json({error:'Server error'}); }});

// Bookings
adminRouter.get('/bookings',               async (req,res) => { try { const bs=await Booking.find().populate('client','name email').populate('worker','name skill').sort('-createdAt'); res.json({bookings:bs}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/bookings/:id/status',  async (req,res) => { try { const b=await Booking.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}); res.json({message:'Status updated',booking:b}); }catch{ res.status(500).json({error:'Server error'}); }});

// Reviews
adminRouter.get('/reviews',                   async (req,res) => { try { const rs=await Review.find().populate('reviewer','name').populate('worker','name').sort('-createdAt'); res.json({reviews:rs}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/reviews/:id/publish',     async (req,res) => { try { const r=await Review.findByIdAndUpdate(req.params.id,{isPublished:true},{new:true}); res.json({message:'Review published',review:r}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.delete('/reviews/:id',            async (req,res) => { try { await Review.findByIdAndDelete(req.params.id); res.json({message:'Review deleted'}); }catch{ res.status(500).json({error:'Server error'}); }});

// Payments
adminRouter.get('/payments', async (req,res) => { try { const ps=await Payment.find().populate('user','name email').populate('worker','name').sort('-createdAt'); res.json({payments:ps}); }catch{ res.status(500).json({error:'Server error'}); }});

// Coupons CRUD
adminRouter.get('/coupons',           async (req,res) => { try { res.json({coupons:await Coupon.find().sort('-createdAt')}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.post('/coupons',          async (req,res) => { try { const c=await Coupon.create(req.body); res.status(201).json({coupon:c}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.patch('/coupons/:id',     async (req,res) => { try { const c=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true}); res.json({coupon:c}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.delete('/coupons/:id',    async (req,res) => { try { await Coupon.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); }catch{ res.status(500).json({error:'Server error'}); }});

// Bulk notification
adminRouter.post('/notify-all', async (req, res) => {
  try {
    const { title, message, type, target } = req.body;
    let users;
    if (target === 'all')     users = await User.find().select('_id');
    else if (target==='workers') {
      const ws = await Worker.find({status:'approved'}).select('userId');
      users    = ws.map(w=>({ _id:w.userId }));
    } else users = await User.find({role:'client'}).select('_id');

    const notifs = users.map(u=>({ user:u._id, title, message, type:type||'system' }));
    await Notification.insertMany(notifs);

    users.forEach(u => io.to(`user_${u._id}`).emit('notification', { title, message, type }));
    res.json({ message:`Notification sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cities
adminRouter.get('/cities',         async (req,res) => { try { res.json({cities:await City.find().sort('name')}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.post('/cities',        async (req,res) => { try { const c=await City.create(req.body); res.status(201).json({city:c}); }catch{ res.status(500).json({error:'Server error'}); }});
adminRouter.delete('/cities/:id',  async (req,res) => { try { await City.findByIdAndDelete(req.params.id); res.json({message:'City deleted'}); }catch{ res.status(500).json({error:'Server error'}); }});

app.use('/api/admin', adminRouter);

/* ── SEARCH ────────────────────────────────────────────────── */
app.get('/api/search', async (req, res) => {
  try {
    const { q, city, category } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });
    const filter = { status:'approved', $or:[{ name:new RegExp(q,'i') },{ skill:new RegExp(q,'i') },{ tags:new RegExp(q,'i') }] };
    if (city)     filter.city     = new RegExp(city,'i');
    if (category) filter.category = category;
    const workers = await Worker.find(filter).limit(20);
    const cats    = await Category.find({ name:new RegExp(q,'i'), isActive:true }).limit(5);
    res.json({ workers, categories:cats });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/* ── HEALTH CHECK ──────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({ status:'ok', timestamp:new Date().toISOString(), uptime:process.uptime(), env:process.env.NODE_ENV||'development' });
});

/* ── FALLBACK to frontend ──────────────────────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/* ── SOCKET.IO ─────────────────────────────────────────────── */
const onlineUsers = new Map();

io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join', ({ userId }) => {
    if (userId) {
      socket.join(`user_${userId}`);
      onlineUsers.set(userId, socket.id);
      io.emit('user_online', { userId, online:true });
    }
  });

  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { userId });
  });

  socket.on('stop_typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('stop_typing', { userId });
  });

  socket.on('join_conversation', ({ conversationId }) => {
    socket.join(conversationId);
  });

  socket.on('send_message', async ({ conversationId, senderId, receiverId, text }) => {
    try {
      const msg = await Message.create({ conversationId, sender:senderId, receiver:receiverId, text, type:'text' });
      await msg.populate('sender','name avatar');
      io.to(conversationId).emit('new_message', msg);
      io.to(`user_${receiverId}`).emit('notification', { title:'New Message', message:text.slice(0,60), type:'chat' });
    } catch(err) { console.error('Socket message error:', err); }
  });

  socket.on('disconnect', () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_online', { userId, online:false });
        break;
      }
    }
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

/* ── ERROR HANDLER ─────────────────────────────────────────── */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

/* ── DATABASE SEED ─────────────────────────────────────────── */
async function seedDatabase() {
  try {
    // Seed admin user
    const adminExists = await User.findOne({ email:'admin@apnaworker.com' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({ name:'Super Admin', email:'admin@apnaworker.com', password:hashed, role:'admin', isVerified:true });
      console.log('✅ Admin user seeded → admin@apnaworker.com / admin123');
    }
    // Seed categories
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      const cats = [
        {name:'Electrician',icon:'⚡',color:'#f59e0b',description:'Home & commercial electrical work',isActive:true,sortOrder:1},
        {name:'Plumber',    icon:'🔧',color:'#06b6d4',description:'Pipe fitting and plumbing repairs',isActive:true,sortOrder:2},
        {name:'Painter',    icon:'🎨',color:'#8b5cf6',description:'Interior & exterior painting',isActive:true,sortOrder:3},
        {name:'Developer',  icon:'💻',color:'#2563eb',description:'Web and app development',isActive:true,sortOrder:4},
        {name:'Designer',   icon:'🖌️',color:'#ec4899',description:'UI/UX and graphic design',isActive:true,sortOrder:5},
        {name:'Carpenter',  icon:'🪚',color:'#84cc16',description:'Furniture and woodwork',isActive:true,sortOrder:6},
        {name:'Mechanic',   icon:'🔩',color:'#f97316',description:'Vehicle and appliance repair',isActive:true,sortOrder:7},
        {name:'Cleaner',    icon:'🧹',color:'#14b8a6',description:'Home and office cleaning',isActive:true,sortOrder:8},
      ];
      await Category.insertMany(cats);
      console.log('✅ Categories seeded');
    }
    // Seed cities
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      await City.insertMany([
        {name:'Varanasi',state:'Uttar Pradesh',isActive:true},
        {name:'Lucknow', state:'Uttar Pradesh',isActive:true},
        {name:'Noida',   state:'Uttar Pradesh',isActive:true},
        {name:'Agra',    state:'Uttar Pradesh',isActive:true},
        {name:'Delhi',   state:'Delhi',         isActive:true},
        {name:'Mumbai',  state:'Maharashtra',   isActive:true},
        {name:'Jaipur',  state:'Rajasthan',     isActive:true},
      ]);
      console.log('✅ Cities seeded');
    }
    // Default coupon
    const couponExists = await Coupon.findOne({ code:'WELCOME20' });
    if (!couponExists) {
      await Coupon.create({ code:'WELCOME20', type:'percent', value:20, minOrder:500, maxUses:500, expiresAt:new Date('2025-12-31') });
      console.log('✅ Default coupon seeded → WELCOME20 (20% off)');
    }
  } catch(err) { console.error('Seed error:', err); }
}

/* ── START SERVER ──────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 ApnaWorker Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 App: http://localhost:${PORT}`);
  console.log(`🔐 Admin: admin@apnaworker.com / admin123\n`);
});
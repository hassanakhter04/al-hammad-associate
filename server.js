require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Simple in-memory brute-force protection for login
const loginAttempts = new Map();
function loginLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + 15 * 60 * 1000; }
  if (entry.count >= 10) {
    return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  }
  entry.count++;
  loginAttempts.set(ip, entry);
  next();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['https://al-hammad-associate.up.railway.app/'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AlHammad@2024';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'alhammad-admin-secret-token-2024';
const ADMIN_PHONE = '+923248321039';

function readProperties() {
  try {
    const raw = fs.readFileSync(PROPERTIES_FILE, 'utf8');
    return JSON.parse(raw).properties || [];
  } catch {
    return [];
  }
}

function saveProperties(properties) {
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify({ properties }, null, 2));
}

function appendToLog(file, entry) {
  let records = [];
  if (fs.existsSync(file)) {
    try { records = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }
  records.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(records, null, 2));
}

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

async function sendWhatsApp(message) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured');
  }
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
    to: `whatsapp:${ADMIN_PHONE}`,
    body: message
  });
}

async function sendEmail(subject, text) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || '1999saad.khan@gmail.com',
    subject,
    text
  });
}

// ─── Property Routes ────────────────────────────────────────────────────────

app.get('/api/properties', (req, res) => {
  let properties = readProperties();
  const { status, featured } = req.query;
  if (status && status !== 'All') {
    properties = properties.filter(p => p.status === status);
  }
  if (featured === 'true') {
    properties = properties.filter(p => p.featured);
  }
  res.json(properties);
});

app.get('/api/properties/:id', (req, res) => {
  const properties = readProperties();
  const property = properties.find(p => p.id === req.params.id);
  if (!property) return res.status(404).json({ error: 'Property not found' });
  res.json(property);
});

app.post('/api/properties', adminAuth, (req, res) => {
  const properties = readProperties();
  const {
    title, price, status, type, bedrooms, bathrooms,
    area, location, description, features, image, featured
  } = req.body;

  if (!title || !price || !status || !image) {
    return res.status(400).json({ error: 'title, price, status, and image are required' });
  }

  const newProperty = {
    id: `prop-${Date.now()}`,
    title, price, status,
    type: type || 'Property',
    bedrooms: parseInt(bedrooms) || 0,
    bathrooms: parseInt(bathrooms) || 0,
    area: area || 'N/A',
    location: location || 'Karachi',
    description: description || '',
    features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
    image,
    gallery: [image],
    featured: featured === true || featured === 'true',
    createdAt: new Date().toISOString()
  };

  properties.push(newProperty);
  saveProperties(properties);
  res.status(201).json(newProperty);
});

app.delete('/api/properties/:id', adminAuth, (req, res) => {
  const properties = readProperties();
  const index = properties.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Property not found' });
  properties.splice(index, 1);
  saveProperties(properties);
  res.json({ success: true, message: 'Property deleted successfully' });
});

// ─── Admin Auth ──────────────────────────────────────────────────────────────

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ─── Admin Forgot Password ───────────────────────────────────────────────────

app.post('/api/admin/forgot-password', async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return res.status(400).json({
      error: 'No admin email is configured on the server. Please ask your developer to set ADMIN_EMAIL in the .env file.'
    });
  }

  try {
    await sendEmail(
      'Admin Password Recovery — Al-Hammad Associate',
      `Hello,\n\nYou requested a password recovery for the Al-Hammad Associate admin dashboard.\n\nYour admin password is:\n\n   ${ADMIN_PASSWORD}\n\nYou can log in at: http://localhost:${process.env.PORT || 3000}/admin.html\n\nIf you did not request this, please ignore this email.\n\n— Al-Hammad Associate System`
    );
    console.log(`[FORGOT-PASSWORD] Recovery email sent to ${adminEmail}`);
    res.json({ success: true, message: `Recovery email sent to ${adminEmail}. Check your inbox.` });
  } catch (err) {
    console.error('[FORGOT-PASSWORD] Email failed:', err.message);
    res.status(500).json({
      error: 'Failed to send email. Please check the email credentials in your .env file, or contact your developer.'
    });
  }
});

// ─── Inquiry Submission ───────────────────────────────────────────────────────

app.post('/api/inquiry', async (req, res) => {
  const { name, phone, propertyId, propertyTitle } = req.body;

  if (!name || !phone || !propertyTitle) {
    return res.status(400).json({ error: 'Name, phone, and property title are required' });
  }

  const alertMessage = `🏠 *New Lead Alert — Al-Hammad Associate*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🏡 *Inquiring About:* ${propertyTitle}\n\n_Reply to this message to connect with the client._`;

  let notifiedVia = null;

  try {
    await sendWhatsApp(alertMessage);
    notifiedVia = 'whatsapp';
    console.log(`[INQUIRY] WhatsApp sent for ${name} re: ${propertyTitle}`);
  } catch (waErr) {
    console.warn('[INQUIRY] WhatsApp failed:', waErr.message);
    try {
      await sendEmail(
        `New Lead: ${name} — ${propertyTitle}`,
        `New Lead Alert!\n\nName: ${name}\nPhone: ${phone}\nProperty: ${propertyTitle}\nProperty ID: ${propertyId || 'N/A'}\n\nTime: ${new Date().toLocaleString()}`
      );
      notifiedVia = 'email';
      console.log(`[INQUIRY] Email fallback sent for ${name}`);
    } catch (emailErr) {
      console.error('[INQUIRY] Email fallback also failed:', emailErr.message);
      notifiedVia = 'log-only';
    }
  }

  appendToLog(INQUIRIES_FILE, { name, phone, propertyId, propertyTitle, notifiedVia });

  res.json({
    success: true,
    message: 'Thank you for your inquiry! Our team will contact you within 24 hours.'
  });
});

// ─── Contact Form ─────────────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  appendToLog(CONTACTS_FILE, { name, email, phone, message });

  try {
    await sendEmail(
      `Contact Form — ${name}`,
      `New Contact Form Submission\n\nName: ${name}\nEmail: ${email || 'N/A'}\nPhone: ${phone}\nMessage: ${message || 'N/A'}\n\nTime: ${new Date().toLocaleString()}`
    );
  } catch (err) {
    console.warn('[CONTACT] Email notification failed:', err.message);
  }

  res.json({
    success: true,
    message: 'Message received! We will get back to you shortly.'
  });
});

// ─── Catch-all: serve frontend ───────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅  Al-Hammad Associate server running at http://localhost:${PORT}`);
  console.log(`   Admin dashboard: http://localhost:${PORT}/admin.html\n`);
});

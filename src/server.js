const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const db = require('./db');

function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' });
}

function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token.replace('Bearer ', ''), config.jwtSecret);
  } catch (error) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader : null;
  const decoded = verifyToken(token || '');

  if (!decoded) {
    return res.status(401).json({ ok: false, message: 'Autenticação necessária.' });
  }

  req.user = decoded;
  next();
}

function ensureDefaultAdmin() {
  const user = db.prepare('SELECT id FROM staff WHERE user_id = ?').get('admin');
  if (!user) {
    db.prepare(`INSERT INTO staff (user_id, username, role, active) VALUES (?, ?, ?, ?)`).run('admin', 'Administrador', 'admin', 1);
  }
}

async function getUserFromLogin(email, password) {
  const user = db.prepare('SELECT * FROM staff WHERE user_id = ?').get('admin');
  if (!user) {
    return null;
  }

  const adminEmail = config.adminEmail;
  const adminPassword = config.adminPassword;

  if (email !== adminEmail) return null;
  if (password !== adminPassword) return null;

  return {
    id: user.user_id,
    username: user.username,
    role: user.role,
    email: adminEmail,
  };
}

module.exports = {
  signToken,
  verifyToken,
  requireAuth,
  ensureDefaultAdmin,
  getUserFromLogin,
};

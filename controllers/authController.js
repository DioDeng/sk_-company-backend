const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// 產生 JWT Token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// 註冊管理員（僅使用一次）
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.create({ username, password });
    res.json({ message: 'Admin Registered', admin });
  } catch (err) {
    console.log(">>> REGISTER ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};

// 登入
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: '帳號不存在' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: '密碼錯誤' });

    const token = generateToken(admin);
    res.json({
      message: '登入成功',
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

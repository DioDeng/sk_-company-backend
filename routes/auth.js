const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 只用來建立第一次 admin（之後可註解掉）
router.post('/register', register);

// 登入
router.post('/login', login);

module.exports = router;

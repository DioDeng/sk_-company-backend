const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const employeeRoutes = require('./employee');
const caseRoutes = require('./case');
const workLogRoutes = require('./workLog');
const payrollRoutes = require('./payroll');
const vendorRoutes = require('./vendor');

// 測試
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Auth v
router.use('/auth', authRoutes);
// Employees員工 v
router.use('/employees', employeeRoutes);
// case案子
router.use('/cases', caseRoutes);
// 工作記錄
router.use('/worklogs', workLogRoutes);
// 薪資
router.use('/payroll', payrollRoutes);
// 廠商
router.use('/vendors', vendorRoutes);

module.exports = router;


// Step 10：Monthly Payroll（薪資結算系統
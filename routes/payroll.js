const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMonthlySalary, getMonthlyPayroll, generateMonthlyPayrollRecords } = require('../controllers/payrollController');

// 產生
router.post('/generate', auth, generateMonthlyPayrollRecords);
// 讀取
router.get('/all', auth, getMonthlyPayroll);
router.get('/:employeeId', auth, getMonthlySalary);


module.exports = router;

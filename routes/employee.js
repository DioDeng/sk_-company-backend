const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// 需要登入才能操作
router.get('/', auth, getEmployees);
router.post('/', auth, createEmployee);
router.put('/:id', auth, updateEmployee);
router.delete('/:id', auth, deleteEmployee);

module.exports = router;

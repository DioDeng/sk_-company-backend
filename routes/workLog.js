const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createWorkLog, getWorkLogs, deleteWorkLog } = require('../controllers/workLogController');

router.post('/', auth, createWorkLog);
router.get('/', auth, getWorkLogs);
router.delete('/:id',auth, deleteWorkLog);

module.exports = router;

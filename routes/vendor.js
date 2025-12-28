const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getVendors,
  createVendor,
  updateVendor,
  disableVendor,
} = require('../controllers/vendorController');

router.get('/', auth, getVendors);
router.post('/', auth, createVendor);
router.put('/:id', auth, updateVendor);
router.delete('/:id', auth, disableVendor);

module.exports = router;

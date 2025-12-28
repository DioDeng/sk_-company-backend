const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入公司名稱'],
      unique: true,
    },
    contactPerson: {
      type: String,
      required: [true, '請輸入負責人'],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    taxId: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', VendorSchema);

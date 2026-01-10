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
      set: v => v === '' ? undefined : v,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^09\d{8}$/.test(v);
        },
        message: '請輸入正確的手機號碼格式 (例如 0912345678)'
      }
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

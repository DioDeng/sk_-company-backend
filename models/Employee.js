const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入員工姓名']
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
    role: {
      type: String,
      enum: ['worker', 'leader', 'staff'],
      default: 'worker'
    },
    hourlyRate: {
      type: Number,
      required: [true, '請輸入時薪'],
      validate: {
        validator: function (v) {
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: '時薪最多只能到小數點後兩位'
      }
    },       
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);

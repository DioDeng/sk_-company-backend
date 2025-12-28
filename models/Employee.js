const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入員工姓名']
    },
    phone: {
      type: String,
      required: [true, '請輸入聯絡電話']
    },
    role: {
      type: String,
      enum: ['worker', 'leader', 'staff'],
      default: 'worker'
    },
    hourlyRate: {
      type: Number,
      required: [true, '請輸入時薪']
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);

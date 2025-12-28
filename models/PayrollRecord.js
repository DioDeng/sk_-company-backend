const mongoose = require('mongoose');

const PayrollRecordSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    month: {
      type: String, // YYYY-MM format
      required: true,
    },
    totalHours: {
      type: Number,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    totalSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

// 同員工同月份不可重複產生薪資單
PayrollRecordSchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('PayrollRecord', PayrollRecordSchema);

const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true, // 允許未填
    },
    name: {
      type: String,
      required: [true, '請輸入工地名稱'],
      unique: true,
    },
    address: {
      type: String,
      required: [true, '請輸入工地地址'],
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },

    // 💰 金額相關
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    contractAmount: {
      type: Number,
      default: 0,
    },

    // 📅 時程
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },

    // 📊 狀態
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'paused', 'completed', 'cancelled'],
      default: 'planning',
    },

    description: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', CaseSchema);

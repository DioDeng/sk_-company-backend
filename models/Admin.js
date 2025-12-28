const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '請輸入帳號'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, '請輸入密碼'],
      minlength: 6,
    },
  },
  { timestamps: true }
);

// 儲存前加密密碼
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 密碼比對方法
AdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);

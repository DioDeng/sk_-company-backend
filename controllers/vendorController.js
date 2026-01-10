const Vendor = require('../models/Vendor');

// 取得所有廠商（可選 active）
exports.getVendors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    }

    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 新增廠商
exports.createVendor = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      phone,
      taxId,
      address = '',
      notes = '',
    } = req.body;

    // ✅ 必填欄位檢查（這是你原本缺的）
    if (!name || !contactPerson || !taxId) {
      return res.status(400).json({
        error: '請確認公司名稱、負責人、統編皆已填寫',
      });
    }

    const vendor = await Vendor.create({
      name,
      contactPerson,
      phone,
      taxId,
      address,
      notes,
    });

    res.json({ message: 'Vendor created', vendor });
  } catch (err) {
    // ✅ unique index 錯誤轉成人話
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `${field} 已存在，請確認是否重複建立`,
      });
    }

    res.status(400).json({ error: err.message });
  }
};

// 更新廠商
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contactPerson,
      phone,
      taxId,
      address,
      notes,
      active,
    } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      {
        name,
        contactPerson,
        phone,
        taxId,
        address,
        notes,
        active,
      },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Vendor updated', vendor });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        error: `${field} 已存在，請確認是否重複`,
      });
    }

    res.status(400).json({ error: err.message });
  }
};

// 停用廠商（Soft delete）
exports.disableVendor = async (req, res) => {
  try {
    const { id } = req.params;

    await Vendor.findByIdAndUpdate(id, { active: false });

    res.json({ message: 'Vendor disabled' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

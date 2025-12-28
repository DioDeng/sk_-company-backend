const Case = require('../models/Case');
const Vendor = require('../models/Vendor');

/**
 * 取得案件列表
 * - 預設只拿 active
 * - 自動 populate vendor
 */
exports.getCases = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    }

    const cases = await Case.find(filter)
      .populate('vendor')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 新增案件
 */
exports.createCase = async (req, res) => {
  try {
    const {
      name,
      vendorId,
      address,
      budget,
      startDate,
      endDate,
      status = 'planning',
      description = '',
    } = req.body;

    // ✅ 必填檢查
    if (!name || !vendorId || !address || !budget || !startDate) {
      return res.status(400).json({
        error: '案件名稱、廠商、地址、金額、開工日為必填',
      });
    }

    // ✅ 廠商驗證（必須存在且 active）
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || !vendor.active) {
      return res.status(400).json({
        error: '廠商不存在或已停用',
      });
    }

    // ✅ 日期邏輯
    if (endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: '開工日不可晚於完工日',
      });
    }

    const newCase = await Case.create({
      name,
      vendor: vendorId,
      address,
      budget,
      startDate,
      endDate,
      status,
      description,
    });

    res.json({ message: 'Case Created', case: newCase });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 更新案件
 */
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // ✅ 若有更新 vendor，要驗證 active
    if (updateData.vendorId) {
      const vendor = await Vendor.findById(updateData.vendorId);
      if (!vendor || !vendor.active) {
        return res.status(400).json({
          error: '廠商不存在或已停用',
        });
      }
      updateData.vendor = updateData.vendorId;
      delete updateData.vendorId;
    }

    // ✅ 狀態轉 completed → 自動填 completedAt
    if (updateData.status === 'completed') {
      updateData.completedAt = new Date();
    }

    // ✅ 日期邏輯
    if (updateData.startDate && updateData.endDate) {
      if (new Date(updateData.startDate) > new Date(updateData.endDate)) {
        return res.status(400).json({
          error: '開工日不可晚於完工日',
        });
      }
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('vendor');

    res.json({ message: 'Case Updated', case: updatedCase });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 停用案件（Soft delete）
 */
exports.deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    await Case.findByIdAndUpdate(id, { active: false });

    res.json({ message: 'Case Disabled' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCaseById = async (req, res) => {
  const { caseId } = req.query;
  const logs = await WorkLog.find({ case: caseId })
    .populate('employee')
    .sort({ date: 1, startTime: 1 });

  res.json(logs);
};

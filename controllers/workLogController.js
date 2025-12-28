const WorkLog = require('../models/WorkLog');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);
/**
 * 取得工時紀錄
 * - 可依 caseId 或 employeeId 篩選
 */
exports.getWorkLogs = async (req, res) => {
  console.log('[getWorkLogs] quer11y:', req.query);

  try {
    const { caseId, employeeId, date } = req.query;

    const filter = { active: true };
    if (caseId) filter.case = caseId;
    if (employeeId) filter.employee = employeeId;

    // ⭐ 關鍵修正：字串 → Date
    if (date) filter.date = new Date(date);

    const logs = await WorkLog.find(filter)
      .populate('employee')
      .populate({
        path: 'case',
        populate: {
          path: 'vendor',
        },
      })
      .sort({ date: 1, startTime: 1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 新增工時（核心邏輯）
 */
exports.createWorkLog = async (req, res) => {
  try {
    const {
      employee,
      caseId,
      date,
      startTime,
      endTime,
    } = req.body;

    // ✅ 必填欄位檢查
    if (!employee || !caseId || !date || !startTime || !endTime) {
      return res.status(400).json({
        error: '員工、案件、日期、開始與結束時間為必填',
      });
    }

    // ✅ 時間格式驗證（HH:mm）
    const start = dayjs(startTime, 'HH:mm');
    const end = dayjs(endTime, 'HH:mm');

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({
        error: '時間格式錯誤，請使用 HH:mm',
      });
    }

    if (!start.isBefore(end)) {
      return res.status(400).json({
        error: '開始時間必須早於結束時間',
      });
    }

    // ✅ 時段重疊檢查（同員工、同日期）
    const overlap = await WorkLog.findOne({
      employee,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (overlap) {
      return res.status(400).json({
        error: '時間重疊！該員工在此時段已有工時紀錄',
      });
    }

    // ✅ 計算工時（小數）
    const hours = end.diff(start, 'minute') / 60;

    const log = await WorkLog.create({
      employee,
      case: caseId, // ⭐ 關鍵：轉換
      date,
      startTime,
      endTime,
      hours,
    });

    res.json({ message: 'WorkLog Created', log });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWorkLog = async (req, res) => {
  try {
    const { id } = req.params;

    await WorkLog.findByIdAndUpdate(id, {
      active: false,
      deletedAt: new Date(),
    });

    res.json({ message: 'WorkLog deleted (soft)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

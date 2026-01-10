const PayrollRecord = require('../models/PayrollRecord');
const WorkLog = require('../models/WorkLog');
const Employee = require('../models/Employee');
const dayjs = require('dayjs');

/**
 * 共用：驗證年月
 */
function validateYearMonth(year, month) {
  if (!year || !month) return false;
  if (!/^\d{4}$/.test(year)) return false;
  if (!/^(0?[1-9]|1[0-2])$/.test(month)) return false;
  return true;
}

/**
 * 取得單一員工某月薪資（查詢用，不寫 DB）
 */
exports.getMonthlySalary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year, month } = req.query;

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({ error: '請提供正確的 year / month' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: '找不到員工' });
    }

    const start = dayjs(`${year}-${month}-01`).startOf('month');
    const end = start.endOf('month');

    const logs = await WorkLog.find({
      active: true,
      employee: employeeId,
      date: { $gte: start.toDate(), $lte: end.toDate() },
    });

    const totalHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const totalSalary = Math.round(totalHours * employee.hourlyRate * 100) / 100;

    res.json({
      employeeId,
      employee: employee.name,
      month: `${year}-${month}`,
      hourlyRate: employee.hourlyRate,
      totalHours,
      totalSalary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 取得全公司某月薪資試算（不寫 DB）
 */
exports.getMonthlyPayroll = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({ error: '請提供 year 和 month，例如 ?year=2025&month=12' });
    }

    const start = dayjs(`${year}-${month}-01`).startOf('month');
    const end = start.endOf('month');

    const logs = await WorkLog.find({
      active: true,
      deletedAt: null,
      date: { $gte: start.toDate(), $lte: end.toDate() },
    }).populate({
      path: 'employee',
      match: { active: true }, // ⭐ 只算在職員工
    });

    const payrollMap = new Map();
    let skippedCount = 0;

    logs.forEach((log) => {
      if (!log.employee) {
        skippedCount += 1;
        return;
      }

      const empId = log.employee._id.toString();
      const hourlyRate = log.employee.hourlyRate || 0;

      const current = payrollMap.get(empId) || {
        employeeId: empId,
        name: log.employee.name,
        hourlyRate,
        totalHours: 0,
        totalSalary: 0,
      };

      current.totalHours += log.hours || 0;
      current.totalSalary = Math.round(current.totalHours * current.hourlyRate * 100) / 100;

      payrollMap.set(empId, current);
    });

    res.json({
      month: `${year}-${month}`,
      payrollList: Array.from(payrollMap.values()),
      skippedLogs: skippedCount, // ⭐ 讓前端知道有被略過的工時
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 產生正式薪資紀錄（寫入 PayrollRecord）
 */
exports.generateMonthlyPayrollRecords = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!validateYearMonth(year, month)) {
      return res.status(400).json({ error: '請提供正確的 year / month' });
    }

    const monthKey = `${year}-${month}`;

    // ✅ 防止重複產生
    const existed = await PayrollRecord.findOne({ month: monthKey });
    if (existed) {
      return res.status(400).json({ error: '該月份薪資已產生，請勿重複操作' });
    }

    const start = dayjs(`${year}-${month}-01`).startOf('month');
    const end = start.endOf('month');

    const logs = await WorkLog.find({
      active: true,
      deletedAt: null,
      date: { $gte: start.toDate(), $lte: end.toDate() },
    }).populate({
      path: 'employee',
      match: { active: true },
    });

    if (!logs.length) {
      return res.status(400).json({ error: '該月份沒有工時紀錄' });
    }

    const payrollMap = new Map();

    logs.forEach((log) => {
      if (!log.employee) return;

      const empId = log.employee._id.toString();
      const hourlyRate = log.employee.hourlyRate || 0;

      const current = payrollMap.get(empId) || {
        employee: empId,
        month: monthKey,
        totalHours: 0,
        hourlyRate,
        totalSalary: 0,
      };

      current.totalHours += log.hours || 0;
      current.totalSalary = Math.round(current.totalHours * current.hourlyRate * 100) / 100;

      payrollMap.set(empId, current);
    });

    if (payrollMap.size === 0) {
      return res.status(400).json({ error: '沒有可產生薪資的有效員工資料' });
    }

    const records = await PayrollRecord.insertMany(Array.from(payrollMap.values()));

    res.json({
      message: '薪資單產生成功',
      month: monthKey,
      count: records.length,
      records,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  TrendingDown, 
  Award, 
  RefreshCw, 
  BookOpen, 
  MessageSquare, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  BarChart2,
  Calendar,
  Download,
  FileSpreadsheet,
  Check,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  exportEvaluationAccuracyCsv, 
  exportFeedbackAuditLogsCsv, 
  exportFullEvaluationReportCsv 
} from '../utils/csvExporter';

export const EvaluationView: React.FC = () => {
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Backtesting accuracy across categories
  const categoryAccuracyData = [
    { category: 'Bakery', mapeBefore: 28.0, mapeAfter: 7.4, wasteReduction: 34.0 },
    { category: 'Fresh Food', mapeBefore: 23.5, mapeAfter: 6.9, wasteReduction: 30.5 },
    { category: 'Ready-to-eat', mapeBefore: 29.4, mapeAfter: 8.2, wasteReduction: 35.5 },
    { category: 'Dessert', mapeBefore: 26.0, mapeAfter: 7.9, wasteReduction: 28.5 },
    { category: 'Beverage', mapeBefore: 17.5, mapeAfter: 5.2, wasteReduction: 22.0 },
  ];

  // Feedback loop override audit logs
  const overrideLogs = [
    { id: 'FB-901', sku: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว', aiQty: 85, userQty: 120, diff: '+35', reason: 'งานอีเวนต์รอบค่ำฮอลล์จัดงาน', status: 'Incorporated in Model v2.4' },
    { id: 'FB-902', sku: 'ครัวซองต์เนยสดฝรั่งเศส', aiQty: 180, userQty: 240, diff: '+60', reason: 'งานสั่งเบเกอรี่เหมาล่วงหน้า', status: 'Incorporated in Model v2.4' },
    { id: 'FB-903', sku: 'ปลาแซลมอนนอร์เวย์สด', aiQty: 45, userQty: 30, diff: '-15', reason: 'สภาพอากาศมรสุมสัญจรลดลง', status: 'Pending Training Batch' },
  ];

  const handleExportFull = () => {
    exportFullEvaluationReportCsv(categoryAccuracyData, overrideLogs, {
      mape: '7.4%',
      wasteReduction: '-28.4%',
      stockoutRate: '1.2%',
      monthlySavings: '฿482,500'
    });
    setExportNotice('ส่งออกรายงานสรุปผลประเมินโมเดลระดับผู้บริหาร (CSV) เรียบร้อยแล้ว');
    setShowExportMenu(false);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportCategory = () => {
    exportEvaluationAccuracyCsv(categoryAccuracyData);
    setExportNotice('ส่งออกสถิติความแม่นยำรายหมวดหมู่ (CSV) เรียบร้อยแล้ว');
    setShowExportMenu(false);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportFeedback = () => {
    exportFeedbackAuditLogsCsv(overrideLogs);
    setExportNotice('ส่งออกบันทึก Feedback Loop & Override (CSV) เรียบร้อยแล้ว');
    setShowExportMenu(false);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 05</span>
              <span>•</span>
              <span>การประเมินผลและการเรียนรู้ปรับปรุง</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              การประเมินความแม่นยำ & ผลลัพธ์ทางธุรกิจ
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              วัดผลด้วยอัตราความคลาดเคลื่อนและผลลัพธ์ทางธุรกิจ (อัตราลดของเสีย, อัตราสินค้าขาดสต็อก) พร้อมแผนส่งเสริมผู้ใช้งานหน้าร้าน และระบบนำข้อมูลที่ผู้จัดการสาขาแก้ไขกลับไปฝึกสอนโมเดลใหม่
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Export CSV Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                title="ส่งออกผลการประเมินและการเปรียบเทียบเป็นไฟล์ CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>ส่งออกรายงาน CSV</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-30 p-1 text-xs divide-y divide-slate-800">
                  <div className="p-1">
                    <button
                      onClick={handleExportFull}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-300 text-slate-200 transition-colors flex items-start gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">รายงานสรุปผู้บริหารทั้งหมด</div>
                        <div className="text-[10px] text-slate-400">รวมตัวชี้วัดหลัก, ความแม่นยำรายหมวด, และการปรับแก้</div>
                      </div>
                    </button>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={handleExportCategory}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-300 text-slate-200 transition-colors flex items-start gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">ความแม่นยำรายหมวดหมู่สินค้า</div>
                        <div className="text-[10px] text-slate-400">เปรียบเทียบก่อน-หลัง และอัตราลดของเสีย</div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportFeedback}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-300 text-slate-200 transition-colors flex items-start gap-2 mt-1"
                    >
                      <Download className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">บันทึกประวัติการปรับแก้ของหน้าร้าน</div>
                        <div className="text-[10px] text-slate-400">ประวัติการปรับยอดและสถานะการเรียนรู้โมเดล</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{isRetraining ? 'กำลังรีเทรนโมเดล...' : '🔁 ทริกเกอร์รีเทรนโมเดลจาก Feedback'}</span>
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">UTF-8 BOM Included</span>
          </div>
        )}

        {/* 4 Core Evaluation KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">ความแม่นยำเฉลี่ย (MAPE)</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">7.4%</div>
            <div className="text-[10px] text-slate-500">ลดความคลาดเคลื่อนจาก 24.8%</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">อัตราการลดลงของขยะ (Waste Rate)</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">-28.4%</div>
            <div className="text-[10px] text-emerald-500 font-medium">🎯 ทะลุเป้าหมาย 20-30%</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">อัตราสินค้าขาดแคลน (Stockout Rate)</div>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">1.2%</div>
            <div className="text-[10px] text-slate-500">ลดลงจาก 7.8% (เกณฑ์ &lt; 2%)</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">ประหยัดเงินสุทธิเฉลี่ย/เดือน</div>
            <div className="text-2xl font-extrabold text-white mt-1">฿482,500</div>
            <div className="text-[10px] text-slate-500">รวม 5 สาขาต้นแบบ</div>
          </div>
        </div>
      </div>

      {retrainSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>โมเดล LightGBM & Prophet ถูกรีเทรนสำเร็จด้วย 14 รายการ Feedback จากผู้จัดการสาขา! ความแม่นยำ MAPE ปรับปรุงขึ้น +0.4%</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">Model Version: v2.5-prod</span>
        </div>
      )}

      {/* Model Backtest Comparison Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              การเปรียบเทียบความแม่นยำก่อนและหลังใช้ AI (MAPE % by Fresh Category)
            </h3>
            <p className="text-xs text-slate-400">
              ค่า MAPE ยิ่งต่ำยิ่งแม่นยำ สังเกตว่ากลุ่มเบเกอรี่และอาหารพร้อมทานลดความผิดพลาดลงได้มากกว่า 65%
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-500/60 rounded" />
              <span className="text-slate-400">ก่อนใช้ AI (MAPE เดิม)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500 rounded" />
              <span className="text-emerald-400 font-semibold">หลังใช้ AI (MAPE ใหม่)</span>
            </div>
            <button
              onClick={handleExportCategory}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ml-auto"
              title="ส่งออกตารางเปรียบเทียบค่าความแม่นยำรายหมวดหมู่นี้เป็นไฟล์ CSV"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>ส่งออก CSV กราฟนี้</span>
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [`${val}%`, name === 'mapeBefore' ? 'MAPE เดิมก่อนมี AI' : 'MAPE ปัจจุบัน (AI)'] }
              />
              <Bar dataKey="mapeBefore" fill="#f43f5e" opacity={0.5} radius={[4, 4, 0, 0]} name="mapeBefore" />
              <Bar dataKey="mapeAfter" fill="#10b981" radius={[4, 4, 0, 0]} name="mapeAfter" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Columns: Feedback Loop & User Adoption Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback Loop System (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                ระบบ Feedback Loop บันทึกเหตุผลการปรับแก้
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportFeedback}
                className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded text-[10px] font-medium transition-colors cursor-pointer"
                title="ส่งออกประวัติการ Override และ Feedback ของหน้าร้านเป็นไฟล์ CSV"
              >
                <Download className="w-2.5 h-2.5 text-purple-400" />
                <span>ส่งออก CSV</span>
              </button>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                Drift Index: 2.4% (Safe)
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            เมื่อผู้ใช้งานหรือฝ่ายจัดซื้อปรับแก้ไขตัวเลขของ AI ข้อมูลเหตุผลจะถูกจัดเก็บเข้าคลังข้อมูลเพื่อนำไปใช้ Retrain โมเดลในรอบสัปดาห์ถัดไปโดยอัตโนมัติ
          </p>

          <div className="space-y-2.5">
            {overrideLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{log.sku}</span>
                  <span className={`font-mono font-bold ${log.diff.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.diff} หน่วย (จาก {log.aiQty} เป็น {log.userQty})
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] mb-1.5">
                  เหตุผลการปรับยอด: <span className="text-amber-300">"{log.reason}"</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">{log.id}</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Adoption Strategy (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                แผนยุทธศาสตร์การยอมรับระบบ (User Adoption Strategy)
              </h3>
            </div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">
              3-Phase Rollout
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-blue-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>ระยะที่ 1: Shadow Running (สัปดาห์ที่ 1 - 2)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                โมเดลพยากรณ์ขนานกับวิธีการสั่งเดิมของพนักงาน จัดอบรมทำความเข้าใจว่า AI ไม่ได้มาแทนที่แต่มาเป็นผู้ช่วยลดของเสีย
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>ระยะที่ 2: Co-Pilot with Override (สัปดาห์ที่ 3 - 6)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ให้ผู้จัดการสาขาใช้ตัวเลขของ AI เป็นค่าตั้งต้น และให้อิสระในการ Override พร้อมระบุเหตุผลเพื่อสร้างความไว้วางใจ
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-purple-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>ระยะที่ 3: Autonomous PO & Incentive Sharing (สัปดาห์ที่ 7 เป็นต้นไป)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ส่งใบสั่งซื้อ PO เข้าซัพพลายเออร์อัตโนมัติในสินค้าที่มีความเชื่อมั่นสูง และมีระบบปันผลโบนัสจากมูลค่า Food Waste ที่สาขาประหยัดได้จริง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

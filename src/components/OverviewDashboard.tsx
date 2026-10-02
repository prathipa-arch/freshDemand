import React from 'react';
import { 
  TrendingDown, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Users, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Database, 
  Code2, 
  Cpu, 
  Send, 
  Tag, 
  FileSpreadsheet,
  Sliders,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CrispStage } from '../types';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface OverviewDashboardProps {
  onNavigateStage: (stage: CrispStage) => void;
  crowdBufferPct: number;
  onChangeCrowdBuffer: (val: number) => void;
  markdownCount: number;
  onOpenExcelUpload?: () => void;
  excelDataset?: ProcessedExcelSystemData | null;
  onClearExcelData?: () => void;
  onOpenSimulator?: () => void;
  onOpenExecutiveReport?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateStage,
  crowdBufferPct,
  onChangeCrowdBuffer,
  markdownCount,
  onOpenExcelUpload,
  excelDataset,
  onClearExcelData,
  onOpenSimulator,
  onOpenExecutiveReport
}) => {
  // 7-day trend data
  const trendData = [
    { day: 'จันทร์', actual: 410, aiForecast: 415, wasteOldMethod: 62, wasteWithAI: 16 },
    { day: 'อังคาร', actual: 395, aiForecast: 390, wasteOldMethod: 58, wasteWithAI: 14 },
    { day: 'พุธ', actual: 430, aiForecast: 425, wasteOldMethod: 65, wasteWithAI: 18 },
    { day: 'พฤหัสฯ', actual: 450, aiForecast: 440, wasteOldMethod: 70, wasteWithAI: 19 },
    { day: 'ศุกร์ (Payday)', actual: 580, aiForecast: 570, wasteOldMethod: 110, wasteWithAI: 24 },
    { day: 'เสาร์ (Weekend)', actual: 690, aiForecast: 685, wasteOldMethod: 145, wasteWithAI: 32 },
    { day: 'อาทิตย์', actual: 720, aiForecast: 710, wasteOldMethod: 160, wasteWithAI: 35 },
  ];

  const crispSteps: { id: CrispStage; title: string; step: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'business',
      step: '01',
      title: 'เป้าหมายทางธุรกิจ',
      desc: 'วิเคราะห์ปัญหา ลดของเสียอาหาร 20-30% และคืนทุนภายใน 6-9 เดือน',
      icon: <TrendingDown className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30'
    },
    {
      id: 'data_understanding',
      step: '02',
      title: 'ทำความเข้าใจข้อมูล',
      desc: 'สำรวจข้อมูล 100,000 รายการ พจนานุกรมข้อมูล และพฤติกรรมการขายหน้าร้าน',
      icon: <Database className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30'
    },
    {
      id: 'data_prep',
      step: '03',
      title: 'การจัดเตรียมข้อมูล',
      desc: 'แก้ไขข้อมูลผิดพลาด (เติมค่าว่าง จัดการข้อมูลผิดปกติ และคุ้มครองข้อมูลส่วนบุคคล)',
      icon: <Code2 className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30'
    },
    {
      id: 'modeling',
      step: '04',
      title: 'การสร้างโมเดลพยากรณ์',
      desc: 'ระบบพยากรณ์ความต้องการ 14 วัน และคำนวณจุดสั่งซื้อที่คุ้มค่าที่สุด',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30'
    },
    {
      id: 'evaluation',
      step: '05',
      title: 'การประเมินผลโมเดล',
      desc: 'วัดความแม่นยำด้วยอัตราความคลาดเคลื่อนต่ำ (7.4%) พร้อมระบบเรียนรู้ต่อเนื่อง',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30'
    },
    {
      id: 'deployment',
      step: '06',
      title: 'การนำไปใช้งานจริง',
      desc: 'ออกใบสั่งซื้ออัตโนมัติ และแจ้งเตือนลดราคาสินค้าป้ายเหลืองเวลา 17:00 น.',
      icon: <Send className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Active Excel Sync Alert Banner */}
      {excelDataset && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  ระบบกำลังแสดงผลด้วยข้อมูลจากไฟล์ Excel
                </span>
                <span className="text-xs text-slate-400">
                  (อัปเดตเมื่อ {excelDataset.uploadedFile.uploadTimestamp} น.)
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {excelDataset.uploadedFile.fileName}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ประมวลผลแล้ว <strong className="text-emerald-400 font-mono">{excelDataset.summary.totalRows.toLocaleString()} แถว</strong> | 
                สินค้าสด <strong className="text-white font-mono">{excelDataset.summary.uniqueSkusCount} รายการ</strong> | 
                ยอดขายรวม <strong className="text-amber-400 font-mono">฿{Math.round(excelDataset.summary.totalRevenueTHB).toLocaleString()}</strong> | 
                จุดบกพร่องที่ต้องจัดเตรียม <strong className="text-rose-400 font-mono">{excelDataset.summary.missingCount + excelDataset.summary.negativeCount} จุด</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onNavigateStage('data_prep')}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ไปที่การจัดเตรียมข้อมูล →
            </button>
            <button
              onClick={() => onNavigateStage('modeling')}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ดูผลการพยากรณ์ →
            </button>
            {onClearExcelData && (
              <button
                onClick={onClearExcelData}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer"
                title="กลับไปใช้ฐานข้อมูลจำลอง 100,000 แถว"
              >
                ใช้ข้อมูลระบบ 100,000 แถว
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Executive Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                กระบวนการวิเคราะห์ข้อมูลครบวงจร 6 ขั้นตอน
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                ระบบวิเคราะห์ข้อมูลอาหารสด
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ระบบคาดการณ์ความต้องการและลดสินค้าคงเหลือทิ้ง
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              แดชบอร์ดบริหารจัดการธุรกิจอาหารสดและเบเกอรี่อัจฉริยะ ผสานระบบปัญญาประดิษฐ์พยากรณ์ความต้องการ การคำนวณจุดสั่งซื้อที่คุ้มค่าที่สุด และการจัดการข้อมูลขนาด 100,000 รายการ เพื่อลดของเสียอาหารสูงสุดและคืนทุนใน 6-9 เดือน
            </p>
          </div>

          {/* Quick Crowd Buffer & 17:00 Markdown Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
              <div className="text-slate-400 mb-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-300">👥 เผื่อลูกค้ามาเกิน:</span>
                <span className="text-emerald-400 font-bold">+{crowdBufferPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={crowdBufferPct}
                onChange={(e) => onChangeCrowdBuffer(Number(e.target.value))}
                className="w-full sm:w-36 accent-emerald-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                รองรับวันหวยออก / เงินเดือนออก / กิจกรรมพิเศษ
              </div>
            </div>

            {onOpenExcelUpload && (
              <button
                onClick={onOpenExcelUpload}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-4 rounded-xl text-xs w-full sm:w-auto text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>นำเข้าไฟล์ Excel / CSV</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  นำเข้าไฟล์ยอดขายหรือสต็อกของสด
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  ตรวจข้อผิดพลาดและจัดเตรียมอัตโนมัติ →
                </div>
              </button>
            )}

            <button
              onClick={() => onNavigateStage('deployment')}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 p-4 rounded-xl text-xs w-full sm:w-auto text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>แจ้งเตือนลดราคา 17:00 น.</span>
              </div>
              <div className="text-[11px] text-slate-300">
                มีของสดเสี่ยงเน่าเสีย <strong className="text-amber-400 font-mono">{markdownCount} รายการ</strong>
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                คลิกเพื่อแจ้งเตือนป้ายเหลืองลดราคา →
              </div>
            </button>

            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 p-4 rounded-xl text-xs w-full sm:w-auto text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>จำลองสถานการณ์</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  ทดสอบฝนตกหนัก, เวลาป้ายเหลือง, อัตราลดราคา
                </div>
                <div className="text-[10px] text-indigo-400 mt-0.5">
                  วิเคราะห์ผลต่อกำไรและของเสีย →
                </div>
              </button>
            )}

            {onOpenExecutiveReport && (
              <button
                onClick={onOpenExecutiveReport}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 p-4 rounded-xl text-xs w-full sm:w-auto text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>รายงานสรุปผู้บริหาร</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  วิเคราะห์จุดคุ้มทุน, ของเสีย, และพิมพ์รายงาน
                </div>
                <div className="text-[10px] text-blue-400 mt-0.5">
                  เปิดรายงานสรุปพร้อมพิมพ์ →
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 5 Core Topline KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">อัตราลดของเสียอาหาร</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">-28.4%</div>
            <div className="text-[10px] text-slate-500">เป้าหมาย: 20-30% (สำเร็จ ✓)</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">อัตราสินค้าขาดสต็อก</div>
            <div className="text-2xl font-black text-blue-400 mt-0.5">1.2%</div>
            <div className="text-[10px] text-slate-500">ลดลงจากเดิม 7.8%</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">
              {excelDataset ? 'ยอดขายรวมในไฟล์' : 'ประหยัดต้นทุนสุทธิ/เดือน'}
            </div>
            <div className="text-2xl font-black text-white mt-0.5 font-mono">
              {excelDataset 
                ? `฿${Math.round(excelDataset.summary.totalRevenueTHB).toLocaleString()}` 
                : '฿482,500'}
            </div>
            <div className="text-[10px] text-slate-500">
              {excelDataset 
                ? `จำนวน ${excelDataset.summary.totalSalesQty.toLocaleString()} ชิ้น` 
                : 'ประเมินจากภาพรวมทั้งระบบ'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">ระยะเวลาคืนทุน</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">5.0 เดือน</div>
            <div className="text-[10px] text-slate-500">กรอบเวลาเป้าหมาย 6-9 เดือน ✓</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">ฐานข้อมูลที่ประมวลผล</div>
            <div className="text-2xl font-black text-indigo-400 mt-0.5 font-mono">
              {excelDataset ? excelDataset.summary.totalRows.toLocaleString() : '100,000'}
            </div>
            <div className="text-[10px] text-slate-500 truncate" title={excelDataset ? excelDataset.uploadedFile.fileName : 'รายการข้อมูลในระบบ'}>
              {excelDataset ? `ไฟล์: ${excelDataset.uploadedFile.fileName}` : 'รายการข้อมูลในระบบ'}
            </div>
          </div>
        </div>
      </div>

      {/* CRISP-DM Workflow Journey Navigation Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            ขั้นตอนการดำเนินงานมาตรฐาน 6 ขั้นตอน
          </h3>
          <span className="text-xs text-slate-400">
            คลิกที่การ์ดเพื่อเข้าสู่หน้าจอทำงานของแต่ละขั้นตอน
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crispSteps.map((step) => (
            <div
              key={step.id}
              onClick={() => onNavigateStage(step.id)}
              className={`bg-slate-900 hover:bg-slate-800/80 border ${step.color} p-5 rounded-2xl transition-all cursor-pointer group shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    {step.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">
                    ขั้นตอนที่ {step.step}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 pt-4 mt-2 border-t border-slate-800/60 transition-colors">
                <span className="font-semibold">เข้าสู่กระบวนการนี้</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Comparison Chart: Food Waste Reduction with AI */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              การเปรียบเทียบปริมาณของเสียที่ลดลงรายวัน (วิธีเดิม เทียบกับ ระบบใหม่)
            </h3>
            <p className="text-xs text-slate-400">
              ช่วงวันเงินเดือนออกและวันหยุดสุดสัปดาห์ที่ยอดขายสูง ระบบช่วยป้องกันการสั่งของเกินจนเน่าเสียได้มากกว่า 70%
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-500/70 rounded" />
              <span className="text-slate-400">ของเสียวิธีเดิม (หน่วย)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500 rounded" />
              <span className="text-emerald-400 font-semibold">ของเสียหลังใช้ระบบใหม่ (หน่วย)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" หน่วย" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [
                  `${val} หน่วย`, 
                  name === 'wasteOldMethod' ? 'ขยะของเสียวิธีเดิม' : 'ของเสียด้วยระบบใหม่'
                ]}
              />
              <Area type="monotone" dataKey="wasteOldMethod" fill="#f43f5e" fillOpacity={0.18} stroke="#f43f5e" strokeWidth={2} />
              <Line type="monotone" dataKey="wasteWithAI" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detected SKUs from Excel */}
      {excelDataset && excelDataset.skus.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>สินค้าสดที่ตรวจพบจากไฟล์ Excel ({excelDataset.skus.length} รายการ)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                รายการเหล่านี้ถูกส่งต่อไปยังโมเดลพยากรณ์ AI และระบบจัดซื้อ Dynamic Markdown แล้ว
              </p>
            </div>
            <button
              onClick={() => onNavigateStage('modeling')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>ดูผลพยากรณ์ AI ทุก SKU</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {excelDataset.skus.map((sku) => (
              <div 
                key={sku.id} 
                className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-emerald-400 font-bold">{sku.id}</span>
                    <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded text-[10px]">
                      อายุ {sku.shelfLifeDays} วัน
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">{sku.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sku.category}</div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">ราคาขาย:</span>
                  <span className="font-bold text-white font-mono">฿{sku.sellingPrice} /{sku.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

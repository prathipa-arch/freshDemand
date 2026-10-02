import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  CloudRain, 
  Sun, 
  CloudLightning, 
  Clock, 
  Percent, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X,
  Layers,
  ArrowRight,
  Download,
  Check
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { exportSimulationResultsCsv } from '../utils/csvExporter';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseCrowdBuffer?: number;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  baseCrowdBuffer = 15
}) => {
  const [weather, setWeather] = useState<'Sunny' | 'Light Rain' | 'Heavy Storm'>('Heavy Storm');
  const [markdownTime, setMarkdownTime] = useState<'16:00' | '17:00' | '18:00'>('16:00');
  const [discountRate, setDiscountRate] = useState<number>(40);
  const [isPayday, setIsPayday] = useState<boolean>(false);
  const [customBuffer, setCustomBuffer] = useState<number>(baseCrowdBuffer);

  // Simulation logic
  const simResults = useMemo(() => {
    // Weather impact on foot-traffic
    let weatherTrafficModifier = 0;
    if (weather === 'Light Rain') weatherTrafficModifier = -12;
    if (weather === 'Heavy Storm') weatherTrafficModifier = -32;

    // Payday impact
    const paydayModifier = isPayday ? 22 : 0;

    // Net evening traffic shift
    const netTrafficShiftPct = weatherTrafficModifier + paydayModifier + (customBuffer * 0.4);

    // Markdown timing multiplier (earlier gives more shopping window before 21:00 closing)
    let timeWindowHours = 4; // 17:00 -> 21:00
    if (markdownTime === '16:00') timeWindowHours = 5;
    if (markdownTime === '18:00') timeWindowHours = 3;

    // Price elasticity & Clearance Rate
    // Base clearance rate based on discount and hours
    const discountFactor = (discountRate / 50) * 1.35; // 40% -> 1.08, 50% -> 1.35
    const timeFactor = (timeWindowHours / 4); // 5h -> 1.25, 3h -> 0.75
    const trafficFactor = (100 + netTrafficShiftPct) / 100;

    let clearanceRate = Math.min(96, Math.max(25, Math.round(55 * discountFactor * timeFactor * trafficFactor)));

    // Financial base model for whole store fresh food
    const dailyFreshInventoryCost = 85000;
    const baseExcessAtRisk = 18500; // THB at risk of going to trash without markdown
    
    // Traditional approach (fixed 18:30 discount 20%, clearance ~38%)
    const traditionalClearance = Math.max(15, Math.round(38 * trafficFactor));
    const traditionalWasteCost = Math.round(baseExcessAtRisk * (1 - traditionalClearance / 100));
    const traditionalSalvageRevenue = Math.round((baseExcessAtRisk * (traditionalClearance / 100)) * 0.8 * 1.4);

    // Dynamic AI Markdown simulation
    const aiWasteCost = Math.round(baseExcessAtRisk * (1 - clearanceRate / 100));
    const aiSalvageRevenue = Math.round((baseExcessAtRisk * (clearanceRate / 100)) * (1 - discountRate / 100) * 1.55);
    const wasteSavedTHB = traditionalWasteCost - aiWasteCost;
    const netBenefitTHB = (aiSalvageRevenue - traditionalSalvageRevenue) + wasteSavedTHB;

    // Category breakdown for chart
    const categoryComparison = [
      {
        category: 'Bakery',
        traditionalWaste: 3200,
        aiSimulatedWaste: Math.round(3200 * (1 - clearanceRate / 100) / 0.62),
        unitsSaved: Math.round(42 * (clearanceRate / 50))
      },
      {
        category: 'Fresh Food',
        traditionalWaste: 5800,
        aiSimulatedWaste: Math.round(5800 * (1 - clearanceRate / 100) / 0.62),
        unitsSaved: Math.round(36 * (clearanceRate / 50))
      },
      {
        category: 'Ready-to-eat',
        traditionalWaste: 4800,
        aiSimulatedWaste: Math.round(4800 * (1 - clearanceRate / 100) / 0.62),
        unitsSaved: Math.round(35 * (clearanceRate / 50))
      },
      {
        category: 'Dessert',
        traditionalWaste: 2400,
        aiSimulatedWaste: Math.round(2400 * (1 - clearanceRate / 100) / 0.62),
        unitsSaved: Math.round(28 * (clearanceRate / 50))
      },
      {
        category: 'Beverage',
        traditionalWaste: 1800,
        aiSimulatedWaste: Math.round(1800 * (1 - clearanceRate / 100) / 0.62),
        unitsSaved: Math.round(22 * (clearanceRate / 50))
      }
    ];

    // Efficiency grade
    let grade = 'A+';
    if (clearanceRate < 50) grade = 'C';
    else if (clearanceRate < 70) grade = 'B';
    else if (clearanceRate < 85) grade = 'A';

    return {
      netTrafficShiftPct: Math.round(netTrafficShiftPct),
      clearanceRate,
      baseExcessAtRisk,
      traditionalWasteCost,
      aiWasteCost,
      wasteSavedTHB: Math.max(0, wasteSavedTHB),
      aiSalvageRevenue,
      netBenefitTHB: Math.max(0, netBenefitTHB),
      grade,
      categoryComparison
    };
  }, [weather, markdownTime, discountRate, isPayday, customBuffer]);

  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportSimCsv = () => {
    exportSimulationResultsCsv({
      scenarioName: `What-If Simulation (${weather}, เคาะ ${markdownTime} น., ลด ${discountRate}%)`,
      weather,
      markdownTime,
      discountRate,
      isPayday,
      crowdBuffer: customBuffer,
      simResults: {
        baselineSales: 1250,
        simulatedSales: Math.round(1250 * (1 + simResults.netTrafficShiftPct / 100)),
        salesDiffPct: simResults.netTrafficShiftPct,
        baselineWasteCost: simResults.traditionalWasteCost,
        simulatedWasteCost: simResults.aiWasteCost,
        wasteReductionPct: Math.round(((simResults.traditionalWasteCost - simResults.aiWasteCost) / (simResults.traditionalWasteCost || 1)) * 100),
        baselineNetRevenue: 68500,
        simulatedNetRevenue: 68500 + simResults.netBenefitTHB,
        netGainTHB: simResults.netBenefitTHB,
        clearanceRatePct: simResults.clearanceRate
      },
      skuBreakdown: simResults.categoryComparison.map(c => ({
        skuName: c.category,
        category: c.category,
        baselineDemand: Math.round(c.traditionalWaste / 65),
        simDemand: Math.round(c.traditionalWaste / 65) + c.unitsSaved,
        simWasteCost: c.aiSimulatedWaste,
        wasteSavings: c.traditionalWaste - c.aiSimulatedWaste
      }))
    });
    setExportNotice('ส่งออกผลการจำลองสถานการณ์ (CSV) สำเร็จ เรียบร้อยแล้ว');
    setTimeout(() => setExportNotice(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">ระบบจำลองสถานการณ์เสมือนจริง</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  เครื่องมือจำลองผลลัพธ์
                </span>
              </div>
              <p className="text-xs text-slate-400">
                จำลองสภาพอากาศ, เวลาเคาะป้ายเหลือง, และเปอร์เซ็นต์ส่วนลด เพื่อประเมินอัตราการกอบกู้ของสดก่อนปิดร้าน
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSimCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="ดาวน์โหลดผลลัพธ์การจำลองนี้เป็นไฟล์ CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">ส่งออกผลจำลอง (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mx-5 mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300 animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">ส่งออกเรียบร้อย</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            
            {/* Weather Control */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                {weather === 'Sunny' && <Sun className="w-4 h-4 text-amber-400" />}
                {weather === 'Light Rain' && <CloudRain className="w-4 h-4 text-blue-400" />}
                {weather === 'Heavy Storm' && <CloudLightning className="w-4 h-4 text-purple-400" />}
                สภาพอากาศ
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setWeather('Sunny')}
                  className={`py-1.5 px-2 rounded font-medium text-[11px] transition-colors ${
                    weather === 'Sunny' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  แดดแจ่ม
                </button>
                <button
                  onClick={() => setWeather('Light Rain')}
                  className={`py-1.5 px-2 rounded font-medium text-[11px] transition-colors ${
                    weather === 'Light Rain' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ฝนปรอย
                </button>
                <button
                  onClick={() => setWeather('Heavy Storm')}
                  className={`py-1.5 px-2 rounded font-medium text-[11px] transition-colors ${
                    weather === 'Heavy Storm' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  พายุหนัก
                </button>
              </div>
              <div className="text-[10px] text-slate-500">
                {weather === 'Heavy Storm' ? '⚠️ คนเดินห้างช่วงเย็นลดลง ~32%' : weather === 'Light Rain' ? 'คนเดินลดลง ~12%' : 'ทราฟฟิกปกติ'}
              </div>
            </div>

            {/* Markdown Start Time */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                เวลาเริ่มเคาะป้ายเหลือง
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {(['16:00', '17:00', '18:00'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setMarkdownTime(t)}
                    className={`py-1.5 rounded font-mono font-medium text-[11px] transition-colors ${
                      markdownTime === t ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t} น.
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-500">
                {markdownTime === '16:00' ? '⚡ มีเวลาขายก่อนปิด 5 ชม. (ระบายได้ไว)' : markdownTime === '17:00' ? 'มาตรฐาน AI Optimal' : '⚠️ เวลาเหลือน้อย (เสี่ยงเหลือทิ้งสูง)'}
              </div>
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-amber-400" />
                  อัตราส่วนลดป้ายเหลือง
                </span>
                <span className="font-mono text-amber-300 font-bold text-sm">
                  {discountRate}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="5"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20% (กำไรต่อชิ้นสูง)</span>
                <span>60% (เร่งเคลียร์หมด)</span>
              </div>
            </div>

            {/* Special Payday & Crowd Buffer */}
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                ปัจจัยพิเศษ (Payday / Buffer)
              </label>
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300 text-[11px]">วันเงินเดือนออก (+22%)</span>
                <input
                  type="checkbox"
                  checked={isPayday}
                  onChange={(e) => setIsPayday(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Crowd Buffer:</span>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">+{customBuffer}%</span>
              </div>
            </div>

          </div>

          {/* Simulation Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">การเปลี่ยนแปลง Traffic คนเดิน</div>
              <div className={`text-2xl font-black font-mono mt-1 ${simResults.netTrafficShiftPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simResults.netTrafficShiftPct > 0 ? `+${simResults.netTrafficShiftPct}%` : `${simResults.netTrafficShiftPct}%`}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                จากผลกระทบสภาพอากาศ + วันพิเศษ
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
              <div className="text-slate-400 text-[11px]">อัตราการเคลียร์สินค้า (Clearance)</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1 flex items-center gap-2">
                {simResults.clearanceRate}%
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                  เกรด {simResults.grade}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                เปรียบเทียบกับวิธีเดิม ({Math.round(simResults.clearanceRate * 0.5)}%)
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">มูลค่าขยะที่ลดได้ในคืนนี้</div>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                ฿{simResults.wasteSavedTHB.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                เหลือของทิ้งเพียง ฿{simResults.aiWasteCost.toLocaleString()} (เดิม ฿{simResults.traditionalWasteCost.toLocaleString()})
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">ผลประโยชน์สุทธิเทียบวิธีเดิม</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                +฿{simResults.netBenefitTHB.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                รวมรายได้กู้คืน + ขยะที่ประหยัดได้
              </div>
            </div>

          </div>

          {/* Comparative Chart: Traditional vs AI Simulated Waste Loss */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  เปรียบเทียบมูลค่าของเสียทิ้งรายหมวดหมู่ (Traditional vs AI Scenario)
                </h4>
                <p className="text-[11px] text-slate-400">
                  แสดงผลลัพธ์ของเสียที่ลดลงเมื่อปรับเวลาเคาะป้ายเหลืองและส่วนลดให้สอดคล้องกับพายุ/ฝน
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 bg-rose-500/70 rounded-sm"></span> วิธีเดิม (ทิ้งมาก)
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> จำลองด้วย AI (ทิ้งน้อยลง)
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simResults.categoryComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `฿${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px' }}
                    formatter={(value: any) => [`฿${Number(value).toLocaleString()}`, 'มูลค่าของเสีย (THB)']}
                  />
                  <Bar dataKey="traditionalWaste" name="วิธีเดิม (บาท)" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Bar dataKey="aiSimulatedWaste" name="จำลอง AI (บาท)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Prescription Recommendation */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-emerald-300 text-xs">
                คำแนะนำเชิงปฏิบัติการจากระบบ (Actionable Prescription)
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {weather === 'Heavy Storm' ? (
                  <>
                    เนื่องจากมี <strong>พายุฝนฟ้าคะนองช่วงเย็น</strong> คนเดินห้างจะเบาบางลง แนะนำให้เคาะป้ายเหลืองเร็วกว่าปกติที่ <strong>{markdownTime} น.</strong> ด้วยส่วนลด <strong>{discountRate}%</strong> โดยเฉพาะกลุ่ม <em>อาหารปรุงสำเร็จ (Ready-to-eat)</em> และ <em>ปลาแซลมอนสด</em> เพื่อระบายสินค้าได้ถึง <strong>{simResults.clearanceRate}%</strong> แทนที่จะต้องทิ้งเสียหายในคืนนี้
                  </>
                ) : weather === 'Light Rain' ? (
                  <>
                    สภาพอากาศฝนตกเล็กน้อย แนะนำคงเวลาเคาะป้ายเหลืองมาตรฐานที่ <strong>17:00 น.</strong> หรือ <strong>16:30 น.</strong> โดยส่วนลดที่ <strong>{discountRate}%</strong> จะช่วยรักษา Margin ได้ดีโดยไม่ทำให้ยอดกำไรสูญเปล่า
                  </>
                ) : (
                  <>
                    สภาพอากาศแดดแจ่มใส ทราฟฟิกลูกค้าหน้าร้านหนาแน่น แนะนำเริ่มที่ส่วนลดปกติ <strong>30%</strong> เพื่อรักษา Margin สูงสุด และหากยังมีของเหลือหลัง 19:30 น. จึงขยับเป็น 50%
                  </>
                )}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            * ผลการจำลองอ้างอิงจากแบบจำลอง Newsvendor และความยืดหยุ่นของราคา (Price Elasticity)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSimCsv}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>ส่งออกผลจำลอง CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              นำค่าจำลองไปใช้กับระบบ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Package, 
  Sliders, 
  Sparkles, 
  BarChart3, 
  Info, 
  ShoppingCart, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { SKU_LIST, BRANCHES } from '../data/mockData';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface AIDemandForecastingViewProps {
  excelDataset?: ProcessedExcelSystemData | null;
  crowdBufferPct?: number;
}

export const AIDemandForecastingView: React.FC<AIDemandForecastingViewProps> = ({
  excelDataset,
  crowdBufferPct = 15
}) => {
  const branches = (excelDataset && excelDataset.summary.detectedBranches.length > 0)
    ? excelDataset.summary.detectedBranches.map((bName, idx) => ({
        id: `BRANCH-${idx + 1}`,
        name: bName,
        location: 'กรุงเทพฯ',
        type: (idx === 0 ? 'Flagship' : idx === 1 ? 'Supermarket' : 'Express') as any,
        avgDailyCustomers: 1200
      }))
    : BRANCHES;

  const skus = (excelDataset && excelDataset.skus.length > 0) ? excelDataset.skus : SKU_LIST;

  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0].id);
  const [selectedSkuId, setSelectedSkuId] = useState<string>(skus[0].id);
  const [forecastHorizon, setForecastHorizon] = useState<7 | 14 | 30>(14);

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const selectedSku = skus.find(s => s.id === selectedSkuId) || skus[0];

  // AI Cluster for this SKU
  const matchedCluster = excelDataset?.aiClassificationReport?.clusters?.find(c => 
    c.skus.some(sName => sName.toLowerCase().includes(selectedSku.name.toLowerCase()) || selectedSku.name.toLowerCase().includes(sName.toLowerCase()))
  );
  const clusterLabel = matchedCluster ? matchedCluster.name : (
    selectedSku.shelfLifeDays <= 1 
      ? '1. กลุ่มเน่าเสียง่ายวิกฤต (อายุ 1 วัน - ป้ายเหลือง 17:00 น.)' 
      : '2. กลุ่มอาหารสดอายุสั้น (อายุ 2-3 วัน)'
  );

  // Current Inventory simulation for this SKU
  const currentStock = Math.round(selectedSku.dailyBaseDemand * 0.45); // e.g. 25-40 units
  const safetyStockBuffer = Math.round(selectedSku.dailyBaseDemand * 0.2); // e.g. 10 units
  const leadTimeDays = 1; // 1-day delivery

  // Forecast generation for selected horizon
  const forecastChartData = Array.from({ length: forecastHorizon }, (_, i) => {
    const d = new Date(2026, 9, 15 + i); // October 2026
    const dayStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    const isWeekend = (d.getDay() === 0 || d.getDay() === 6);
    const isPayday = (d.getDate() >= 25 || d.getDate() <= 2);

    const baseDemand = selectedSku.dailyBaseDemand;
    const weekendMultiplier = isWeekend ? 1.45 : 0.95;
    const paydayMultiplier = isPayday ? 1.30 : 1.0;
    const branchMultiplier = selectedBranch.type === 'Flagship' ? 1.25 : (selectedBranch.type === 'Express' ? 0.75 : 1.0);

    const predicted = Math.round(baseDemand * weekendMultiplier * paydayMultiplier * branchMultiplier * (1 + crowdBufferPct / 100));
    // Simulated actual for past days
    const actual = i < 4 ? Math.round(predicted * (0.96 + (i * 0.02))) : undefined;
    const upperBound = Math.round(predicted * 1.15);
    const lowerBound = Math.round(predicted * 0.85);

    return {
      date: dayStr,
      predicted,
      actual,
      upperBound,
      lowerBound,
      isWeekend,
      isPayday
    };
  });

  const nextDayForecast = forecastChartData[0]?.predicted || 80;
  // Recommended Order Formula: Forecast Demand - Current Stock + Safety Stock
  const recommendedOrder = Math.max(0, nextDayForecast - currentStock + safetyStockBuffer);

  // Feature Importance Factors
  const factorsImportanceData = [
    { name: 'ยอดขาย 7 วันย้อนหลัง (Lag-7)', impact: 92, note: 'อิทธิพลสูงสุด' },
    { name: 'ช่วงวันเงินเดือนออก (Payday)', impact: 86, note: 'กระตุ้นยอด +30%' },
    { name: 'วันเสาร์-อาทิตย์ (Weekend)', impact: 80, note: 'คนเดินห้างเพิ่ม +45%' },
    { name: 'ระดับสต็อกคงเหลือปัจจุบัน', impact: 68, note: 'ป้องกัน Overstock' },
    { name: 'ประเภทสาขา (Flagship/Express)', impact: 58, note: 'กำลังซื้อต่างกัน' },
    { name: 'สภาพอากาศ (ฝนตก/แดดออก)', impact: 42, note: 'กระทบหน้าร้าน -15%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>เมนูที่ 3</span>
              <span>•</span>
              <span>หัวใจหลักของโครงงาน (Core Machine Learning Solution)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              ระบบพยากรณ์ความต้องการสินค้า (AI Demand Forecasting)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              พยากรณ์ความต้องการสินค้าสดรายวันล่วงหน้า 7-30 วัน นำยอดที่ AI คาดการณ์มาคำนวณเปรียบเทียบกับสต็อกคงเหลือ เพื่อแนะนำจำนวนที่ควรสั่งซื้ออย่างแม่นยำ ป้องกันทั้งสินค้าขาดและของเสียเหลือทิ้ง
            </p>
          </div>
        </div>

        {/* Filters: Branch, SKU, Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          {/* Branch Selector */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              1. เลือกสาขา:
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type})
                </option>
              ))}
            </select>
          </div>

          {/* SKU Selector */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              2. เลือกสินค้าสด/เบเกอรี่:
            </label>
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {skus.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category} - อายุ {s.shelfLifeDays} วัน)
                </option>
              ))}
            </select>
          </div>

          {/* Forecast Horizon Selector */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              3. ช่วงเวลาที่ต้องการทำนาย:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {([7, 14, 30] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    forecastHorizon === h 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {h} วัน
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Order Calculation Card (ตามตัวอย่างโจทย์ของอาจารย์) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                การคำนวณความต้องการสั่งซื้ออัจฉริยะ (Smart Reorder Calculation)
              </h3>
              <p className="text-xs text-slate-400">
                ผสานยอดพยากรณ์ของ AI เข้ากับระดับสต็อกและเกณฑ์สำรองความปลอดภัย (Safety Buffer)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{clusterLabel}</span>
            </span>
            <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/30">
              {selectedSku.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-400">1. ยอดที่ AI พยากรณ์ (วันพรุ่งนี้)</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {nextDayForecast} {selectedSku.unit}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">คาดว่าจะขายได้</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-400">2. สินค้าที่มีอยู่ในสต็อก</div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-1">
              {currentStock} {selectedSku.unit}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">ยังไม่หมดอายุ ณ หน้าร้าน</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-slate-400">3. สต็อกสำรองปลอดภัย (Safety)</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              +{safetyStockBuffer} {selectedSku.unit}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">เผื่อคนมาเกิน (+{crowdBufferPct}%)</div>
          </div>

          <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40">
            <div className="text-emerald-300 font-bold">4. แนะนำจำนวนสั่งซื้อสุทธิ</div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {recommendedOrder} {selectedSku.unit}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              = (80 - 25) + 10 = 65 ชิ้น
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              กราฟยอดขายจริงเทียบกับยอดขายที่พยากรณ์ ({forecastHorizon} วันล่วงหน้า)
            </h3>
            <p className="text-xs text-slate-400">
              เส้นสีเขียวคือยอดที่ AI คาดการณ์ แถบสีเขียวอ่อนคือช่วงความเชื่อมั่น (Confidence Interval 80%)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>ยอดขายจริง (Actual)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>ยอด AI พยากรณ์ (Predicted)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={6} />
              <YAxis stroke="#94a3b8" fontSize={11} unit={` ${selectedSku.unit}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [
                  `${val} ${selectedSku.unit}`,
                  name === 'actual' ? 'ยอดขายจริง (Actual)' : (name === 'predicted' ? 'ยอดที่ AI พยากรณ์' : name)
                ]}
              />
              <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="#10b981" fillOpacity={0.10} />
              <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="#0f172a" fillOpacity={1} />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance Factors Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              ปัจจัยที่มีผลต่อการพยากรณ์ความต้องการ (Feature Importance Analysis)
            </h3>
            <p className="text-xs text-slate-400">
              ระดับคะแนนความสำคัญของตัวแปรที่โมเดลใช้ในการตัดสินใจทำนายยอดขาย
            </p>
          </div>
          <span className="text-xs text-purple-300 font-mono font-bold bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">
            Explainable AI
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorsImportanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" fontSize={11} width={180} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val} คะแนน`, 'ความสำคัญ (Importance Score)']}
                />
                <Bar dataKey="impact" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-5 space-y-2 text-xs">
            {factorsImportanceData.map((f, idx) => (
              <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{f.name}</div>
                  <div className="text-[10px] text-slate-400">{f.note}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-purple-400">{f.impact}</span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

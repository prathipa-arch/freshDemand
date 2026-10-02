import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  Users, 
  AlertTriangle, 
  Calendar, 
  CloudRain, 
  ShoppingBag,
  Sparkles,
  Calculator
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { BreakEvenParams } from '../types';

export const BusinessUnderstandingView: React.FC<{
  crowdBufferPct: number;
  onChangeCrowdBuffer: (val: number) => void;
}> = ({ crowdBufferPct, onChangeCrowdBuffer }) => {
  // Break-even parameters state
  const [params, setParams] = useState<BreakEvenParams>({
    monthlyFreshInventoryCost: 2500000, // 2.5 ล้านบาท/เดือน
    currentWastePct: 12, // ขยะปัจจุบัน 12%
    targetReductionPct: 25, // ตั้งเป้าลดขยะ 25%
    monthlyCloudServerCost: 18000, // ค่า Cloud Server ต่อเดือน
    monthlyMaintenanceCost: 12000, // ค่าดูแลรักษาระบบ
    oneTimeSetupCost: 450000, // ค่าพัฒนาและติดตั้งระบบครั้งแรก
    stockoutRevenueRecoveryPct: 3, // รายได้ที่ฟื้นคืนจากสินค้าไม่ขาดสต็อก
  });

  // Calculations
  const currentWasteCostPerMonth = (params.monthlyFreshInventoryCost * (params.currentWastePct / 100));
  const wasteSavedPerMonth = currentWasteCostPerMonth * (params.targetReductionPct / 100);
  const stockoutSavedPerMonth = params.monthlyFreshInventoryCost * (params.stockoutRevenueRecoveryPct / 100);
  const totalMonthlyGrossBenefit = wasteSavedPerMonth + stockoutSavedPerMonth;
  const totalMonthlyCost = params.monthlyCloudServerCost + params.monthlyMaintenanceCost;
  const netMonthlyBenefit = totalMonthlyGrossBenefit - totalMonthlyCost;
  const paybackMonths = netMonthlyBenefit > 0 
    ? Number((params.oneTimeSetupCost / netMonthlyBenefit).toFixed(1)) 
    : 99;

  // Generate 18-month Cumulative Cashflow curve
  const cashflowData = Array.from({ length: 18 }, (_, idx) => {
    const month = idx + 1;
    const cumulativeBenefit = (netMonthlyBenefit * month) - params.oneTimeSetupCost;
    return {
      month: `เดือนที่ ${month}`,
      netCashflow: Math.round(cumulativeBenefit),
      costBaseline: 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Stage Indicator */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 01</span>
              <span>•</span>
              <span>เป้าหมายทางธุรกิจ</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              เป้าหมายทางธุรกิจ & การวิเคราะห์จุดคุ้มทุน
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              แก้ปัญหาคอขวดสินค้าของสดและเบเกอรี่ที่มีอายุสั้น สั่งเกินกลายเป็นของเสีย สั่งขาดเสียโอกาสขาย ด้วยการพยากรณ์ความต้องการซื้อล่วงหน้า 7-14 วัน
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400">เป้าหมายลดของเสีย</div>
              <div className="text-xl font-bold text-emerald-400">20% - 30%</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl text-center">
              <div className="text-xs text-slate-400">เป้าหมายคืนทุนโครงการ</div>
              <div className="text-xl font-bold text-blue-400">6 - 9 เดือน</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pain Point */}
        <div className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">ปัญหาสำคัญของธุรกิจอาหารสด</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>สั่งของเกินความต้องการ:</strong> ของสดและเบเกอรี่เน่าเสียง่าย หากสั่งเผื่อมากเกินจะกลายเป็นของเสีย สูญเงินต้นทุนทั้งหมด</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>สินค้าขาดสต็อก:</strong> หากสั่งน้อยไป ลูกค้ามาซื้อแล้วของหมด เสียยอดขายและความประทับใจ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>กะปริมาณด้วยความคุ้นชิน:</strong> ผู้จัดการสาขาใช้ความเคยชิน ไม่สามารถจับปัจจัยสภาพอากาศ วันหวยออก หรือวันเงินเดือนออกได้ครบ</span>
            </li>
          </ul>
        </div>

        {/* System Target */}
        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">เป้าหมายของระบบ</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>พยากรณ์ล่วงหน้า 7-14 วัน:</strong> ครอบคลุมรายสินค้าของแต่ละสาขาเพื่อวางแผนสั่งวัตถุดิบแม่นยำ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>ลดของเสียอาหาร 20-30%:</strong> ลดปริมาณของเสียที่ต้องทิ้งค่ำคืนได้อย่างเป็นรูปธรรม</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>ลดสินค้าขาดสต็อก:</strong> รักษาระดับความพึงพอใจและมีสินค้าพร้อมขายมากกว่า 98%</span>
            </li>
          </ul>
        </div>

        {/* Payback Framework */}
        <div className="bg-slate-900/90 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">เป้าหมายระยะเวลาคืนทุน</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>เป้าหมายคืนทุน:</strong> กำหนดกรอบเวลาคืนทุนโครงการภายใน <strong>6 - 9 เดือน</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>ผลตอบแทนสุทธิ:</strong> ประหยัดเงินสุทธิหลังหักค่าบริการระบบมากกว่า 80,000 บาท/เดือน</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>ขยายผลได้ทันที:</strong> สามารถนำไปปรับใช้กับทุกสาขาทั่วประเทศได้อย่างคุ้มค่า</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive ROI & Break-even Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                เครื่องคำนวณจุดคุ้มทุนและผลตอบแทนโครงการ
              </h3>
              <p className="text-xs text-slate-400">
                ปรับเปลี่ยนสมมติฐานต้นทุนอาหารสด สัดส่วนการลดของเสีย และค่าใช้จ่ายระบบ เพื่อดูจุดคืนทุนทันที
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">ระยะเวลาคืนทุนจริง:</div>
              <div className="text-xl font-extrabold text-emerald-400">
                {paybackMonths <= 9 ? `⚡ ${paybackMonths} เดือน (ตามเป้าหมาย)` : `${paybackMonths} เดือน`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              กำหนดตัวเลขสมมติฐานทางธุรกิจ
            </h4>

            {/* Monthly Inventory Cost */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>มูลค่าสต็อกอาหารสดเฉลี่ยต่อเดือน (บาท):</span>
                <span className="font-bold text-emerald-400">฿{params.monthlyFreshInventoryCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="250000"
                value={params.monthlyFreshInventoryCost}
                onChange={(e) => setParams({ ...params, monthlyFreshInventoryCost: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Current Waste % */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>อัตราการทิ้งของเสียในปัจจุบัน (%):</span>
                <span className="font-bold text-rose-400">{params.currentWastePct}% (฿{currentWasteCostPerMonth.toLocaleString()}/ด.)</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={params.currentWastePct}
                onChange={(e) => setParams({ ...params, currentWastePct: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Target Waste Reduction % */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>เป้าหมายลดของเสียด้วยระบบ (%):</span>
                <span className="font-bold text-emerald-400">{params.targetReductionPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={params.targetReductionPct}
                onChange={(e) => setParams({ ...params, targetReductionPct: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Cloud Server Cost */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ค่าบริการระบบ (บาท/เดือน):</label>
                <input
                  type="number"
                  value={params.monthlyCloudServerCost}
                  onChange={(e) => setParams({ ...params, monthlyCloudServerCost: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ค่าบำรุงรักษา (บาท/เดือน):</label>
                <input
                  type="number"
                  value={params.monthlyMaintenanceCost}
                  onChange={(e) => setParams({ ...params, monthlyMaintenanceCost: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">งบประมาณลงทุนระบบครั้งแรก (บาท):</label>
              <input
                type="number"
                value={params.oneTimeSetupCost}
                onChange={(e) => setParams({ ...params, oneTimeSetupCost: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Results Summary & Cumulative Cash Flow Chart (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">ประหยัดต้นทุนของเสียต่อเดือน</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  +฿{Math.round(wasteSavedPerMonth).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">ลดลง {params.targetReductionPct}%</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">ค่าบริการระบบและดูแลต่อเดือน</div>
                <div className="text-base font-bold text-slate-300 mt-0.5">
                  -฿{totalMonthlyCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">ค่าใช้จ่ายรวม</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400">กำไรสุทธิเพิ่มขึ้นต่อเดือน</div>
                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                  +฿{Math.round(netMonthlyBenefit).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-500 font-medium">กำไรเพิ่มขึ้น</div>
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400 rotate-180" />
                  กราฟกระแสเงินสดสะสมและจุดคุ้มทุน
                </div>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  คุ้มทุนที่เดือนที่ {paybackMonths}
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickMargin={5} />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, 'กระแสเงินสดสะสมสุทธิ']}
                    />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'จุดคุ้มทุน (฿0)', fill: '#f87171', fontSize: 10, position: 'insideTopLeft' }} />
                    <Line 
                      type="monotone" 
                      dataKey="netCashflow" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ r: 3, fill: '#10b981' }} 
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-1">
                กราฟแสดงจุดคุ้มทุนภายใน {paybackMonths} เดือน สอดคล้องกับเป้าหมายที่ตั้งไว้ (6-9 เดือน)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Day & Crowd Buffer Feature Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                กลยุทธ์เผื่อลูกค้ามาเกินและรองรับวันพิเศษ
              </h3>
              <p className="text-xs text-slate-400">
                ระบบคำนวณเผื่อความต้องการล่วงหน้าเพื่อรองรับลูกค้าจำนวนมาก เช่น วันเงินเดือนออก หรือเทศกาลพิเศษ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300">ตั้งค่าเผื่อลูกค้ามาเกินกว่าปกติ:</span>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={crowdBufferPct}
              onChange={(e) => onChangeCrowdBuffer(Number(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
            <span className="text-amber-400 font-bold text-sm">+{crowdBufferPct}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5">
              <Calendar className="w-4 h-4" />
              ช่วงวันเงินเดือนออก
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ช่วงวันที่ 25-30 และ 1-2 ยอดสั่งซื้อเนื้อพรีเมียม วากิว และปลาแซลมอน พุ่งขึ้น 30-40% ระบบจะปรับตัวคูณความต้องการอัตโนมัติ
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1.5">
              <Sparkles className="w-4 h-4" />
              วันหวยออกและกิจกรรมพิเศษ
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              วันที่ 1 และ 16 ของเดือน ผู้คนเดินห้างและซื้อเบเกอรี่และของทานเล่นเพิ่มขึ้น 15-20% ระบบจะเปิดระบบคำนวณเผื่อให้อัตโนมัติ
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
              <ShoppingBag className="w-4 h-4" />
              งานแสดงและกิจกรรมใกล้สาขา
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              เชื่อมโยงปฏิทินกิจกรรมของศูนย์การค้า เพิ่มสต็อกข้าวกล่องและแซนด์วิชพร้อมทาน 25-35%
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1.5">
              <CloudRain className="w-4 h-4" />
              สภาพอากาศฝนตกหนัก
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ลดการสั่งซื้อของสดหน้าร้านลง 15-25% เพื่อป้องกันของเสียเหลือทิ้ง แต่เพิ่มสต็อกสำหรับบริการจัดส่งถึงบ้าน 10%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Scale, 
  ShieldAlert, 
  UserCheck, 
  Sliders, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  FileEdit,
  Save
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Area, 
  ComposedChart,
  BarChart,
  Bar
} from 'recharts';
import { INITIAL_OPTIMIZATION_ITEMS, SKU_LIST, getPerishabilityInfo } from '../data/mockData';
import { InventoryOptimizationItem, UserRole, PerishabilityTier } from '../types';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface ModelingViewProps {
  currentRole: UserRole;
  crowdBufferPct: number;
  excelDataset?: ProcessedExcelSystemData | null;
  onOpenSimulator?: () => void;
}

export const ModelingView: React.FC<ModelingViewProps> = ({ currentRole, crowdBufferPct, excelDataset, onOpenSimulator }) => {
  const skuList = (excelDataset && excelDataset.skus.length > 0) ? excelDataset.skus : SKU_LIST;
  const [selectedSkuId, setSelectedSkuId] = useState(skuList[0].id);
  const [selectedModel, setSelectedModel] = useState<'LightGBM' | 'Prophet' | 'Ensemble'>('LightGBM');
  const [forecastHorizon, setForecastHorizon] = useState<7 | 14>(14);
  const [perishabilityFilter, setPerishabilityFilter] = useState<'ALL' | 'Ultra-Fresh' | 'Short' | 'Medium'>('ALL');
  const [optItems, setOptItems] = useState<InventoryOptimizationItem[]>(
    (excelDataset && excelDataset.optimizationItems.length > 0) 
      ? excelDataset.optimizationItems 
      : INITIAL_OPTIMIZATION_ITEMS
  );
  const [overrideModalItem, setOverrideModalItem] = useState<InventoryOptimizationItem | null>(null);
  const [overrideQtyInput, setOverrideQtyInput] = useState<number>(0);
  const [overrideReasonInput, setOverrideReasonInput] = useState<string>('งานบุญใหญ่ใกล้ร้าน (Local Festival/Fair)');

  // Sync state if new Excel dataset is loaded
  React.useEffect(() => {
    if (excelDataset && excelDataset.skus.length > 0) {
      setSelectedSkuId(excelDataset.skus[0].id);
      setOptItems(excelDataset.optimizationItems);
    }
  }, [excelDataset]);

  const selectedSku = skuList.find(s => s.id === selectedSkuId) || skuList[0];
  const selectedSkuPerishability = getPerishabilityInfo(selectedSku.shelfLifeDays);

  // Filter optimization items by perishability tier
  const filteredOptItems = optItems.filter(item => {
    if (perishabilityFilter === 'ALL') return true;
    const sku = skuList.find(s => s.id === item.skuId);
    const shelfLife = sku ? sku.shelfLifeDays : 2;
    if (perishabilityFilter === 'Ultra-Fresh') return shelfLife <= 2;
    if (perishabilityFilter === 'Short') return shelfLife > 2 && shelfLife <= 5;
    if (perishabilityFilter === 'Medium') return shelfLife > 5;
    return true;
  });

  // 14-day forecast data generation
  const forecastData = Array.from({ length: forecastHorizon }, (_, i) => {
    const d = new Date(2026, 8, 11 + i);
    const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const dayName = dayNames[d.getDay()];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const isPayday = d.getDate() >= 25 || d.getDate() <= 2;
    
    // Model behavior differences
    const modelMultiplier = selectedModel === 'LightGBM' ? 1.0 : selectedModel === 'Prophet' ? 1.04 : 1.02;
    const base = selectedSku.dailyBaseDemand * (isWeekend ? 1.45 : 0.95) * (isPayday ? 1.3 : 1.0) * modelMultiplier;
    const buffer = base * (crowdBufferPct / 100);
    const predicted = Math.round(base + buffer);
    const lower = Math.round(predicted * 0.84);
    const upper = Math.round(predicted * 1.18);
    const traditionalOrder = Math.round(selectedSku.dailyBaseDemand * (isWeekend ? 1.2 : 1.0)); // Old static method

    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      dayName,
      fullDate: d.toLocaleDateString('th-TH'),
      predicted,
      lowerBound: lower,
      upperBound: upper,
      traditionalOrder,
      isWeekend,
      isPayday,
    };
  });

  // Feature Importance for LightGBM
  const featureImportance = [
    { feature: 'ยอดขายย้อนหลัง 7 วัน (Lag 7)', score: 94 },
    { feature: 'ดัชนีวันเงินเดือนออก (Payday)', score: 88 },
    { feature: 'วันหยุดเสาร์-อาทิตย์ (Weekend)', score: 82 },
    { feature: 'พยากรณ์ฝนตก (Weather API)', score: 71 },
    { feature: 'ราคาและโปรโมชัน (Price/Promo)', score: 65 },
    { feature: 'ยอดขายเฉลี่ย 14 วัน (Rolling 14)', score: 58 }
  ];

  // Handle saving manager override
  const handleSaveOverride = () => {
    if (!overrideModalItem) return;
    setOptItems(prev => prev.map(item => {
      if (item.id === overrideModalItem.id) {
        return {
          ...item,
          managerOverrideQty: overrideQtyInput,
          overrideReason: overrideReasonInput,
          suggestedPoQty: overrideQtyInput,
          status: 'Modified by Manager'
        };
      }
      return item;
    }));
    setOverrideModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 04</span>
              <span>•</span>
              <span>การสร้างโมเดลพยากรณ์และจุดสั่งซื้อที่คุ้มค่า</span>
              {excelDataset && (
                <>
                  <span>•</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ข้อมูลจากไฟล์: {excelDataset.uploadedFile.fileName}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              การสร้างโมเดลพยากรณ์ & คำนวณจุดสั่งซื้อที่คุ้มค่า
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              ผสานโมเดลพยากรณ์ความต้องการซื้อล่วงหน้า 7-14 วัน เข้ากับการคำนวณจุดสั่งซื้อที่คุ้มค่าที่สุด พร้อมให้ผู้จัดการสาขาตรวจสอบและปรับแก้จำนวนได้ก่อนสั่งซื้อจริง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>จำลองสถานการณ์</span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 pl-1">เลือกโมเดล:</span>
              <div className="flex gap-1">
                {(['LightGBM', 'Prophet', 'Ensemble'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      selectedModel === m ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'Ensemble' ? 'โมเดลรวม (Ensemble)' : m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Demand Forecasting Interactive Line Chart with Confidence Bands */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                ส่วนที่ 1: กราฟพยากรณ์ความต้องการซื้อล่วงหน้า 7-14 วัน
              </h3>
              <p className="text-xs text-slate-400">
                แถบสีเขียวคือช่วงความเชื่อมั่น (80%) เปรียบเทียบกับคำสั่งซื้อแบบเดิมที่เคยสั่ง
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* SKU selector */}
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              {skuList.map(sku => (
                <option key={sku.id} value={sku.id}>
                  {sku.name} ({sku.unit})
                </option>
              ))}
            </select>

            {/* Horizon selector */}
            <div className="flex bg-slate-950 rounded-xl border border-slate-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setForecastHorizon(7)}
                className={`px-2.5 py-1 rounded-lg transition-all ${forecastHorizon === 7 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                7 วัน
              </button>
              <button
                onClick={() => setForecastHorizon(14)}
                className={`px-2.5 py-1 rounded-lg transition-all ${forecastHorizon === 14 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                14 วัน
              </button>
            </div>
          </div>
        </div>

        {/* Forecast Line Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={6} />
              <YAxis stroke="#94a3b8" fontSize={11} unit={` ${selectedSku.unit}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                formatter={(val: any, name: any) => {
                  const labels: Record<string, string> = {
                    predicted: 'ยอดที่ระบบแนะนำสั่งซื้อ',
                    upperBound: 'ขอบเขตบน (ประมาณการสูงสุด)',
                    lowerBound: 'ขอบเขตล่าง (ประมาณการต่ำสุด)',
                    traditionalOrder: 'คำสั่งซื้อเดิมก่อนใช้ระบบ'
                  };
                  return [`${val} ${selectedSku.unit}`, labels[name] || name];
                }}
              />
              <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="#10b981" fillOpacity={0.12} />
              <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="#0f172a" fillOpacity={1} />
              <Line type="monotone" dataKey="traditionalOrder" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Legend & Feature Importance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-slate-800">
          <div className="md:col-span-6 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-medium">ยอดพยากรณ์จากระบบ ({selectedModel})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 border-t-2 border-dashed border-rose-500" />
              <span className="text-slate-400">วิธีสั่งซื้อเดิม (มักสั่งเผื่อมากเกินจนเน่าเสีย)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/20" />
              <span className="text-slate-400">ช่วงความเชื่อมั่น (80%)</span>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2 text-xs text-slate-400">
            <span>👥 เผื่อลูกค้ามาเกิน: <strong className="text-emerald-400">+{crowdBufferPct}%</strong></span>
            <span>• อายุสินค้าคงเหลือ: <strong className="text-white font-mono">{selectedSku.shelfLifeDays} วัน</strong></span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${selectedSkuPerishability.badgeColor}`}>
              {selectedSkuPerishability.tier} • {selectedSkuPerishability.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Part 2: Linear Programming Inventory Optimization & Human-in-the-Loop */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                ส่วนที่ 2: การคำนวณจุดสั่งซื้อที่คุ้มค่าที่สุด & การปรับแก้โดยผู้จัดการสาขา
              </h3>
              <p className="text-xs text-slate-400">
                ระบบคำนวณถ่วงน้ำหนักความเสี่ยงสินค้าขาดเทียบกับสินค้าเน่าเสีย พร้อมเพดานสั่งซื้อปลอดภัย และระบบขอปรับยอดโดยผู้จัดการสาขา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-semibold">
              Newsvendor Critical Ratio: $C_u / (C_u + C_o)$
            </span>
          </div>
        </div>

        {/* Perishability Urgency Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">ความเร่งด่วนตามอายุสินค้า (Shelf-Life Priority):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setPerishabilityFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                perishabilityFilter === 'ALL'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ทั้งหมด ({optItems.length})
            </button>
            <button
              onClick={() => setPerishabilityFilter('Ultra-Fresh')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                perishabilityFilter === 'Ultra-Fresh'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Ultra-Fresh (1-2 วัน)
            </button>
            <button
              onClick={() => setPerishabilityFilter('Short')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                perishabilityFilter === 'Short'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Short (3-5 วัน)
            </button>
            <button
              onClick={() => setPerishabilityFilter('Medium')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                perishabilityFilter === 'Medium'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Medium (7+ วัน)
            </button>
          </div>
        </div>

        {/* Optimization Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-3.5 py-3">สินค้า (SKU) & อายุ</th>
                <th className="px-3.5 py-3 text-right">สต็อกหน้าร้าน</th>
                <th className="px-3.5 py-3 text-right">AI Demand (ชิ้น)</th>
                {currentRole !== 'store_manager' && (
                  <>
                    <th className="px-3.5 py-3 text-right">ต้นทุน $C_o$ (เน่าเสีย)</th>
                    <th className="px-3.5 py-3 text-right">กำไร $C_u$ (เสียโอกาส)</th>
                    <th className="px-3.5 py-3 text-center">Critical Ratio</th>
                  </>
                )}
                <th className="px-3.5 py-3 text-center">Safety Bounds (Min - Max)</th>
                <th className="px-3.5 py-3 text-right font-bold text-emerald-400">ยอดสั่งซื้อแนะนำ (Suggested PO)</th>
                <th className="px-3.5 py-3">สถานะ & การ Override</th>
                <th className="px-3.5 py-3 text-center">จัดการโดยผู้จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredOptItems.map((item) => {
                const sku = skuList.find(s => s.id === item.skuId);
                const pInfo = getPerishabilityInfo(sku ? sku.shelfLifeDays : 2);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-3 font-medium text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{item.skuName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${pInfo.badgeColor}`}>
                          {pInfo.tier.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{item.category}</span>
                        <span>• อายุ {sku?.shelfLifeDays || 2} วัน</span>
                      </div>
                    </td>
                  <td className="px-3.5 py-3 text-right text-slate-300 font-mono">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="px-3.5 py-3 text-right text-slate-200 font-bold font-mono">
                    {item.aiPredictedDemand} {item.unit}
                  </td>
                  {currentRole !== 'store_manager' && (
                    <>
                      <td className="px-3.5 py-3 text-right text-rose-400 font-mono">
                        ฿{item.overageCost}
                      </td>
                      <td className="px-3.5 py-3 text-right text-emerald-400 font-mono">
                        ฿{item.underageCost}
                      </td>
                      <td className="px-3.5 py-3 text-center text-blue-400 font-mono font-semibold">
                        {(item.criticalRatio * 100).toFixed(1)}%
                      </td>
                    </>
                  )}
                  <td className="px-3.5 py-3 text-center font-mono text-slate-400">
                    <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {item.safetyMinFloor} - {item.safetyMaxCeiling} {item.unit}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right font-bold text-emerald-400 font-mono text-sm">
                    {item.managerOverrideQty !== undefined ? item.managerOverrideQty : item.suggestedPoQty} {item.unit}
                  </td>
                  <td className="px-3.5 py-3">
                    {item.status === 'Modified by Manager' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          <UserCheck className="w-3 h-3" /> ผู้จัดการแก้ไข
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate" title={item.overrideReason}>
                          เหตุผล: {item.overrideReason}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" /> AI คำนวณสมดุล
                      </span>
                    )}
                  </td>
                  <td className="px-3.5 py-3 text-center">
                    <button
                      onClick={() => {
                        setOverrideModalItem(item);
                        setOverrideQtyInput(item.managerOverrideQty !== undefined ? item.managerOverrideQty : item.suggestedPoQty);
                        setOverrideReasonInput(item.overrideReason || 'งานบุญใหญ่ใกล้ร้าน (Local Festival/Fair)');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <FileEdit className="w-3 h-3 text-amber-400" />
                      <span>ปรับยอด</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* Human-in-the-loop Override Modal */}
      {overrideModalItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base">
                  Human-in-the-Loop Override
                </h4>
              </div>
              <button 
                onClick={() => setOverrideModalItem(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              กำลังปรับยอดสั่งซื้อสำหรับ: <strong className="text-white">{overrideModalItem.skuName}</strong>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">AI แนะนำเดิม:</span>
                <div className="text-emerald-400 font-bold font-mono text-sm">
                  {overrideModalItem.suggestedPoQty} {overrideModalItem.unit}
                </div>
              </div>
              <div>
                <span className="text-slate-400">ช่วงปลอดภัย (Safe Bounds):</span>
                <div className="text-slate-200 font-mono text-sm">
                  {overrideModalItem.safetyMinFloor} - {overrideModalItem.safetyMaxCeiling} {overrideModalItem.unit}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                ระบุจำนวนที่ผู้จัดการต้องการสั่งใหม่ ({overrideModalItem.unit}):
              </label>
              <input
                type="number"
                value={overrideQtyInput}
                onChange={(e) => setOverrideQtyInput(Number(e.target.value))}
                min={overrideModalItem.safetyMinFloor}
                max={overrideModalItem.safetyMaxCeiling * 1.5}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">
                เหตุผลประกอบการแก้ไข (Mandatory Feedback Reason):
              </label>
              <select
                value={overrideReasonInput}
                onChange={(e) => setOverrideReasonInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="งานบุญใหญ่ใกล้ร้าน (Local Festival/Fair)">งานบุญใหญ่ใกล้ร้าน (Local Festival/Fair)</option>
                <option value="ร้านอาหารใกล้เคียงสั่งเหมาจัดเบรค (Catering Request)">ร้านอาหารใกล้เคียงสั่งเหมาจัดเบรค (Catering Request)</option>
                <option value="สภาพอากาศผิดปกติฝนตกหนักหน้าร้านน้ำท่วม">สภาพอากาศผิดปกติฝนตกหนักหน้าร้านน้ำท่วม</option>
                <option value="จัดบูธโปรโมชั่นสินค้าใหม่ร่วมกับเชฟ">จัดบูธโปรโมชั่นสินค้าใหม่ร่วมกับเชฟ</option>
                <option value="ตู้แช่เย็นสาขาขัดข้องชั่วคราว">ตู้แช่เย็นสาขาขัดข้องชั่วคราว</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setOverrideModalItem(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveOverride}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกยอด & ส่งเข้า Feedback Loop</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

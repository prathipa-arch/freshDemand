import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Layers, 
  Table, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  TrendingUp, 
  Package, 
  Clock, 
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';
import { AIAutoClassificationReport } from '../types';

interface AIClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  excelDataset?: ProcessedExcelSystemData | null;
}

export const AIClassifierModal: React.FC<AIClassifierModalProps> = ({
  isOpen,
  onClose,
  excelDataset
}) => {
  const [activeTab, setActiveTab] = useState<'clusters' | 'columns' | 'insights'>('clusters');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('cluster-ultra-fresh');

  if (!isOpen) return null;

  // Fallback default report if no custom excel uploaded yet
  const defaultReport: AIAutoClassificationReport = {
    timestamp: 'ล่าสุด',
    overallDataHealthScore: 94,
    detectedColumns: [
      {
        column: 'sales_qty',
        detectedType: 'float64',
        role: 'Target Y (ยอดขาย)',
        confidence: 99,
        imputationAdvice: 'ใช้ Median ของกลุ่ม (สาขา + สินค้า + วันในสัปดาห์)',
        sampleValue: '45.0'
      },
      {
        column: 'date',
        detectedType: 'datetime64',
        role: 'Date/Time (เวลา)',
        confidence: 99,
        imputationAdvice: 'ใช้ทำ Time-Series Train/Test Split ป้องกัน Data Leakage',
        sampleValue: '2026-10-01'
      },
      {
        column: 'sku_name',
        detectedType: 'string (category)',
        role: 'Category/Group (หมวด)',
        confidence: 97,
        imputationAdvice: 'แปลงด้วย One-Hot Encoding หรือ Target Encoding',
        sampleValue: 'ครัวซองต์เนยสด'
      },
      {
        column: 'unit_price',
        detectedType: 'float64',
        role: 'Numeric Feature (ตัวเลข)',
        confidence: 96,
        imputationAdvice: 'ทำ MinMax Scaling ให้อยู่ในช่วง [0, 1]',
        sampleValue: '65.0'
      },
      {
        column: 'customer_tel',
        detectedType: 'string (PII)',
        role: 'PII/Sensitive (ข้อมูลส่วนตัว)',
        confidence: 99,
        imputationAdvice: 'ตัดออกจากฟีเจอร์โมเดล หรือเข้ารหัส SHA-256 ตามกฎหมาย PDPA',
        sampleValue: '081-992-XXXX'
      }
    ],
    clusters: [
      {
        id: 'cluster-ultra-fresh',
        name: '1. กลุ่มเน่าเสียง่ายวิกฤต (Ultra-Perishable / อายุ 1 วัน)',
        clusterType: 'perishability',
        badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
        count: 3,
        skus: ['ครัวซองต์เนยสด', 'ข้าวกล่องแซลมอนย่าง', 'สลัดอกไก่คลีน'],
        description: 'สินค้าที่ต้องจำหน่ายให้หมดวันต่อวัน ห้ามค้างคืน หากเหลือต้องทิ้ง 100%',
        riskLevel: 'สูงมาก',
        recommendedStrategy: 'พยากรณ์ระดับชั่วโมง, ตั้ง Safety Stock ต่ำสุด, บังคับใช้ระบบแจ้งเตือนป้ายเหลือง 17:00 น. ลด 30-50%',
        recommendedModel: 'LightGBM Regressor (Hour-level Granularity)',
        avgDailySales: 110
      },
      {
        id: 'cluster-med-fresh',
        name: '2. กลุ่มอาหารสดอายุสั้น (Short-life Fresh / อายุ 2-3 วัน)',
        clusterType: 'perishability',
        badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
        count: 2,
        skus: ['ปลาแซลมอนนอร์เวย์สด', 'เนื้อวากิวสันนอก A4'],
        description: 'อาหารสดแช่เย็น ต้องบริหารสต็อกแบบ FIFO และเฝ้าระวังวันหมดอายุต่อเนื่อง',
        riskLevel: 'สูง',
        recommendedStrategy: 'สั่งซื้อแบบ Daily Batch Lead Time 1 วัน, ตั้งจุด Reorder Point อิงยอดพยากรณ์ 3 วัน',
        recommendedModel: 'Random Forest Regressor (Non-linear pattern)',
        avgDailySales: 42
      },
      {
        id: 'cluster-fast-velocity',
        name: '3. กลุ่มสินค้าขายเร็วหมุนเวียนสูง (Fast-Moving Velocity)',
        clusterType: 'velocity',
        badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
        count: 2,
        skus: ['ครัวซองต์เนยสด', 'ข้าวกล่องแซลมอนย่าง'],
        description: 'สินค้าที่เป็น Core Traffic Driver ของร้าน ลูกค้าซื้อซ้ำประจำ ยอดขายต่อวันสูง',
        riskLevel: 'ปานกลาง',
        recommendedStrategy: 'เพิ่ม Crowd Buffer เผื่อลูกค้ามาเกิน +15-20% เพื่อป้องกันสินค้าขาด (Stockout Prevention)',
        recommendedModel: 'Ensemble Model (LightGBM + Moving Average Lag-7)',
        avgDailySales: 135
      },
      {
        id: 'cluster-payday-sensitive',
        name: '4. กลุ่มสินค้าพรีเมียมยอดพุ่งสิ้นเดือน (Payday & Weekend Surge)',
        clusterType: 'demand_pattern',
        badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
        count: 2,
        skus: ['เนื้อวากิวสันนอก A4', 'ปลาแซลมอนนอร์เวย์สด'],
        description: 'สินค้าที่ยอดขายตอบสนองแรงกับวันเงินเดือนออก (25-2 ของทุกเดือน) และวันเสาร์-อาทิตย์',
        riskLevel: 'ปานกลาง',
        recommendedStrategy: 'กำหนด Feature Multiplier ช่วงสิ้นเดือน +25% ถึง +40% ป้องกันสต็อกขาดช่วงคนมีกำลังซื้อสูง',
        recommendedModel: 'Calendar-Aware Tree Regressor',
        avgDailySales: 55
      }
    ],
    aiInsights: [
      'AI ตรวจจับโครงสร้างข้อมูลเสร็จสมบูรณ์ และแยกตัวแปรเป้าหมาย (Target Y: sales_qty) พร้อมตัวแปรบอกเวลาเรียบร้อย',
      'สินค้าในกลุ่ม Ultra-Fresh คิดเป็น 60% ของความเสี่ยงขยะอาหาร ระบบจึงแนะนำให้ใช้โมเดล LightGBM ที่จับความผันผวนได้แม่นยำที่สุด',
      'พบว่าคอลัมน์ข้อมูลส่วนตัวลูกค้า (PII) ถูกตรวจจับและเข้ารหัสเรียบร้อยตามมาตรฐาน PDPA',
      'ระบบพร้อมนำข้อมูลที่จัดกลุ่มนี้ไปใช้ในการพยากรณ์ความต้องการ (เมนู 3) และการทดลองโมเดล (เมนู 4) ทันที'
    ]
  };

  const report = excelDataset?.aiClassificationReport || defaultReport;
  const currentCluster = report.clusters.find(c => c.id === selectedClusterId) || report.clusters[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  ระบบ AI จัดกลุ่มและจำแนกข้อมูลอัจฉริยะ (AI Data Classifier & Clustering)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI ENGINE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {excelDataset 
                  ? `วิเคราะห์และจัดหมวดหมู่อัตโนมัติจากไฟล์: ${excelDataset.uploadedFile.fileName} (${excelDataset.summary.totalRows.toLocaleString()} แถว)`
                  : 'วิเคราะห์โครงสร้างข้อมูลตั้งต้นของระบบ พร้อมปรับเปลี่ยนทันทีเมื่ออัปโหลดไฟล์ใหม่'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">คะแนนความสมบูรณ์ข้อมูล:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{report.overallDataHealthScore}/100</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-xs transition-colors border-b-2 ${
              activeTab === 'clusters'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. การจัดกลุ่มสินค้า (Product Clustering)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {report.clusters.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('columns')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-xs transition-colors border-b-2 ${
              activeTab === 'columns'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>2. การจำแนกบทบาทคอลัมน์ (Column Semantic Roles)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {report.detectedColumns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-xs transition-colors border-b-2 ${
              activeTab === 'insights'
                ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. สรุปคำแนะนำจาก AI (Actionable Insights)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CLUSTERS */}
          {activeTab === 'clusters' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cluster List / Selector */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  คลัสเตอร์ที่ AI จัดกลุ่มได้
                </div>
                {report.clusters.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedClusterId(c.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedClusterId === c.id
                        ? `${c.badgeColor} shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/50`
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-700">
                        {c.count} รายการ
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cluster Detail View */}
              <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${currentCluster.badgeColor}`}>
                      ระดับความเสี่ยง: {currentCluster.riskLevel}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">
                      {currentCluster.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">ยอดขายเฉลี่ย/วัน</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      ~{currentCluster.avgDailySales} ชิ้น
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-400" />
                      รายการสินค้าที่ถูกจัดเข้ากลุ่มนี้ ({currentCluster.skus.length} รายการ):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCluster.skus.map((sku, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {sku}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      กลยุทธ์การสั่งซื้อและลดอาหารเหลือทิ้งที่ AI แนะนำ:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentCluster.recommendedStrategy}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-purple-400" />
                      โมเดล Machine Learning ที่เหมาะสมที่สุด:
                    </span>
                    <span className="font-bold text-purple-300 font-mono">
                      {currentCluster.recommendedModel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLUMNS */}
          {activeTab === 'columns' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                ระบบ AI ทำการวิเคราะห์ชื่อคอลัมน์ ชนิดข้อมูล และตัวอย่างค่า เพื่อกำหนดบทบาท (Role) ในการเทรน Machine Learning โดยอัตโนมัติ
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">ชื่อคอลัมน์ในไฟล์</th>
                      <th className="p-3">ชนิดข้อมูล</th>
                      <th className="p-3">บทบาทที่ AI กำหนด (Role)</th>
                      <th className="p-3">ความมั่นใจ (Confidence)</th>
                      <th className="p-3">ตัวอย่างข้อมูล</th>
                      <th className="p-3">คำแนะนำการคลีน (Imputation)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {report.detectedColumns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-white">
                          {col.column}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                            {col.detectedType}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            col.role.includes('Target') ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            col.role.includes('Date') ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            col.role.includes('PII') ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {col.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">
                          {col.confidence}%
                        </td>
                        <td className="p-3 font-mono text-slate-400 max-w-[120px] truncate">
                          {col.sampleValue}
                        </td>
                        <td className="p-3 text-slate-300 text-[11px]">
                          {col.imputationAdvice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-xs text-emerald-200">
                  สรุปข้อค้นพบและการเตรียมการของ AI สำหรับชุดข้อมูลนี้ เพื่อให้พร้อมนำไปใช้งานในทุกเมนูของระบบ
                </div>
              </div>

              <div className="space-y-3">
                {report.aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ข้อมูลจัดกลุ่มเรียบร้อย พร้อมใช้งานในเมนูที่ 1 ถึง 6
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-colors"
          >
            รับทราบและเริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};

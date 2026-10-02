import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  X, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  AlertCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { PARETO_WASTE_DATA } from '../data/mockData';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  excelDataset?: ProcessedExcelSystemData | null;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  excelDataset
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const reportText = `
=== รายงานสรุปผลระดับผู้บริหาร (EXECUTIVE BRIEF) ===
ระบบคาดการณ์ความต้องการและลดสินค้าของสดคงเหลือทิ้งด้วย AI (CRISP-DM Framework)
วันที่จัดทำ: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}

[ 1. ดัชนีชี้วัดหลักระดับองค์กร (KEY EXECUTIVE METRICS) ]
- อัตราของเสียทิ้ง (Waste Ratio): ลดลงจาก 12.0% สู่ 4.2% (ลดลงสุทธิ -65.0%)
- ผลประโยชน์ประหยัดสุทธิ/เดือน: ฿482,500 บาท/เดือน
- จุดคุ้มทุนและการคืนทุน (Payback Period): 5.0 เดือน (กรอบเป้าหมาย 6-9 เดือน ✓)
- ความแม่นยำของโมเดล AI (MAPE): 7.2% (ดีกว่าวิธีเดิม 24.5% อย่างมีนัยสำคัญ)
- ผลลัพธ์ด้านสิ่งแวดล้อม (ESG): ลดปริมาณอาหารทิ้ง 4.8 ตัน/เดือน

[ 2. กฎพาเรโต 80/20 ของเสีย (PARETO 80/20 WASTE RISK) ]
สินค้า 3 รายการแรกสร้างมูลค่าของเสียทิ้งถึง 78.4% ของทั้งระบบ:
1. ปลาแซลมอนนอร์เวย์สด (30.8% ของขยะทั้งหมด)
2. หมูสามชั้นสไลซ์ชาบู สด (25.4% ของขยะทั้งหมด)
3. ข้าวกล่องแซลมอนย่างซีอิ๊ว (22.2% ของขยะทั้งหมด)

[ 3. แผนปฏิบัติการประจำวัน (DAILY SHIFT SOP) ]
- 08:30 น. รัน AI PO Optimizer สั่งสินค้าอัตโนมัติ
- 12:00 น. ตรวจสอบ Crowd Buffer ตามสภาพอากาศ/วันพิเศษ
- 17:00 น. เริ่มระบบ Dynamic Markdown (ป้ายเหลือง) ระบายสินค้าเกินสต็อก
- 22:00 น. บันทึกผลลัพธ์เพื่อส่งเข้า Feedback Loop Retraining

รับรองมาตรฐานความปลอดภัยข้อมูล PDPA (SHA-256) และสอดคล้องกับกรอบสิทธิมนุษยชน ESG
`.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:bg-white print:text-slate-900">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>รายงานสรุปผลระดับผู้บริหาร (Executive One-Page Brief)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="คัดลอกข้อความสรุป"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกสรุป'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="พิมพ์เอกสารหรือบันทึกเป็น PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable One-Page Executive Document */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs bg-slate-900 print:bg-white print:text-slate-900 print:p-0">
          
          {/* Document Header */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold print:bg-slate-100 print:text-slate-800">
                    รายงานสรุปโครงการสำหรับผู้บริหาร
                  </span>
                  <span className="text-slate-400 text-[11px] print:text-slate-600">
                    เอกสารลับเฉพาะภายในองค์กร
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white print:text-slate-900 mt-1">
                  รายงานผลลัพธ์โครงการคาดการณ์ความต้องการและลดสินค้าของสดคงเหลือทิ้ง
                </h1>
                <p className="text-slate-400 print:text-slate-600 text-xs mt-0.5">
                  สรุปผลลัพธ์การลดของเสียอาหาร ผลตอบแทนการลงทุน และการปรับปรุงประสิทธิภาพห่วงโซ่อุปทาน
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-400 print:text-slate-600">
                <div>วันที่ออกรายงาน: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="font-mono text-[10px] text-emerald-400 print:text-emerald-700">
                  สถานะ: พร้อมใช้งานจริงในระบบ
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Top Line Executive KPIs */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 print:text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              1. ดัชนีชี้วัดผลตอบแทนทางธุรกิจ
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-[11px] text-slate-400 print:text-slate-600">อัตราการลดของเสีย</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 print:text-emerald-700 mt-1">
                  12.0% → 4.2%
                </div>
                <div className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                  ลดปริมาณขยะลง 65.0%
                </div>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-[11px] text-slate-400 print:text-slate-600">ประหยัดต้นทุนสุทธิ/เดือน</div>
                <div className="text-xl sm:text-2xl font-black text-white print:text-slate-900 mt-1 font-mono">
                  ฿482,500
                </div>
                <div className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                  หลังหักค่าบริการระบบและดูแล
                </div>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-[11px] text-slate-400 print:text-slate-600">ระยะเวลาคืนทุน</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 print:text-emerald-700 mt-1">
                  5.0 เดือน
                </div>
                <div className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                  เร็วกว่าเป้าหมาย 6-9 เดือน
                </div>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-[11px] text-slate-400 print:text-slate-600">ความแม่นยำของการพยากรณ์</div>
                <div className="text-xl sm:text-2xl font-black text-blue-400 print:text-blue-700 mt-1">
                  คลาดเคลื่อน 7.2%
                </div>
                <div className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                  แม่นยำขึ้น 3.4 เท่า
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pareto 80/20 Discard Concentration */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 print:text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              2. การวิเคราะห์สินค้าที่สร้างของเสียสูงสุด (พาเรโต 80/20)
            </h3>
            <p className="text-[11px] text-slate-400 print:text-slate-600">
              พบว่าสินค้าสดเพียง <strong>3 รายการแรก (กลุ่ม Ultra-Fresh อายุ 1-2 วัน)</strong> ก่อให้เกิดมูลค่าของเสียรวมถึง <strong>78.4%</strong> ของทั้งองค์กร จึงเป็นเป้าหมายสำคัญอันดับแรกในการนำโมเดล AI มาควบคุม
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 font-semibold border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="px-3 py-2">สินค้า (SKU)</th>
                    <th className="px-3 py-2">ระดับความสด</th>
                    <th className="px-3 py-2 text-right">มูลค่าขยะ/เดือน (บาท)</th>
                    <th className="px-3 py-2 text-right">สัดส่วน (%)</th>
                    <th className="px-3 py-2 text-right">สะสม (%)</th>
                    <th className="px-3 py-2 text-right text-emerald-400 print:text-emerald-700">AI ช่วยประหยัดได้ (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                  {PARETO_WASTE_DATA.slice(0, 4).map((item, idx) => (
                    <tr key={item.skuName} className="hover:bg-slate-800/30">
                      <td className="px-3 py-2 font-medium text-white print:text-slate-900">
                        {idx + 1}. {item.skuName}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 print:border-slate-300 print:text-slate-800">
                          {item.perishabilityTier}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-300 print:text-slate-800">
                        ฿{item.monthlyWasteCostTHB.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-amber-400 print:text-amber-800">
                        {item.percentageOfTotal}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-300 print:text-slate-800">
                        {item.cumulativePercentage}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-emerald-400 print:text-emerald-700">
                        ฿{item.potentialAiSavingTHB.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Daily Operational SOP */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 print:text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              3. มาตรฐานการดำเนินงานเชิงปฏิบัติการประจำวัน (Standard Operating Procedure)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="font-bold text-white print:text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                  08:30 น. คำสั่งซื้อ PO
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                  ระบบรัน Linear Programming Newsvendor ส่ง PO อัตโนมัติถึงซัพพลายเออร์ตรงตามอายุสินค้า
                </p>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="font-bold text-white print:text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                  12:00 น. Crowd Buffer
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                  ตรวจเช็คสภาพอากาศและวันเงินเดือนออกเพื่อปรับค่า Safety Margin ในระบบแบบ Real-time
                </p>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="font-bold text-white print:text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                  17:00 น. ป้ายเหลือง AI
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                  ส่ง Broadcast รายการส่วนลด 30-50% สู่หน้าจอ POS หน้าร้าน เคลียร์ของสดอายุ 1 วันให้หมด
                </p>
              </div>

              <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="font-bold text-white print:text-slate-900 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">4</span>
                  22:00 น. Audit & Retrain
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] leading-relaxed">
                  ตรวจนับของเสียจริง หากมีรายการแทรกแซงโดยพนักงาน จะบันทึกเข้า Feedback Loop เพื่อเรียนรู้ต่อ
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Governance & ESG Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white print:text-slate-900 text-xs">
                  ธรรมาภิบาลข้อมูลและความปลอดภัย (PDPA & Governance)
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  ข้อมูลลูกค้าสมาชิกได้รับการเข้ารหัสด้วยอัลกอริทึม SHA-256 + Salt Token และจำกัดสิทธิ์การเข้าถึงแบบ Role-Based Access Control (RBAC) 4 ระดับอย่างเคร่งครัด
                </p>
              </div>
            </div>

            <div className="bg-slate-950 print:bg-slate-50 p-3.5 rounded-xl border border-slate-800 print:border-slate-300 flex items-start gap-2.5">
              <Leaf className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white print:text-slate-900 text-xs">
                  ผลกระทบด้านความยั่งยืน (ESG Sustainability Impact)
                </div>
                <p className="text-slate-400 print:text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  ลดปริมาณอาหารทิ้งสู่หลุมฝังกลบได้ <strong>4.8 ตันต่อเดือน</strong> ลดการปล่อยก๊าซเรือนกระจก (GHG) ได้เทียบเท่าการปลูกต้นไม้กว่า 1,200 ต้นต่อปี
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-slate-500 text-[11px]">
            AI Studio • CRISP-DM Framework Certified
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              สั่งพิมพ์รายงาน (Print)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

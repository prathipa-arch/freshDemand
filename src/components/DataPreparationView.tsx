import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  Eye, 
  Sparkles,
  Lock,
  Zap,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { DIRTY_DATA_SAMPLE, CLEAN_DATA_SAMPLE, PYTHON_CLEANSING_CODE } from '../data/mockData';
import { UserRole } from '../types';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';
import { exportCleanedDatasetCsv, exportDirtyDatasetCsv } from '../utils/csvExporter';

interface DataPreparationViewProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  excelDataset?: ProcessedExcelSystemData | null;
}

export const DataPreparationView: React.FC<DataPreparationViewProps> = ({
  currentRole,
  onChangeRole,
  excelDataset,
}) => {
  const [activeTab, setActiveTab] = useState<'dirty_raw' | 'python_code' | 'clean_result' | 'rbac_matrix'>('dirty_raw');
  const [isExecutingPython, setIsExecutingPython] = useState(false);
  const [executionDone, setExecutionDone] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const dirtyRecords = (excelDataset && excelDataset.dirtySample.length > 0)
    ? excelDataset.dirtySample
    : DIRTY_DATA_SAMPLE;

  const cleanRecords = (excelDataset && excelDataset.cleanSample.length > 0)
    ? excelDataset.cleanSample
    : CLEAN_DATA_SAMPLE;

  const handleExportCleanedCsv = () => {
    const filenamePrefix = excelDataset 
      ? `cleaned_${excelDataset.uploadedFile.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`
      : 'cleaned_fresh_food_features';
    exportCleanedDatasetCsv(cleanRecords, filenamePrefix);
    setExportNotice(`ส่งออกไฟล์ ${filenamePrefix}.csv สำเร็จ (รวม UTF-8 BOM สำหรับ Excel เรียบร้อย)`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportDirtyCsv = () => {
    const filenamePrefix = excelDataset 
      ? `raw_errors_${excelDataset.uploadedFile.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`
      : 'raw_corrupted_data_audit';
    exportDirtyDatasetCsv(dirtyRecords, filenamePrefix);
    setExportNotice(`ส่งออกไฟล์ตรวจสอบข้อผิดพลาด ${filenamePrefix}.csv สำเร็จ`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Simulate running python script
  const handleRunPython = () => {
    setIsExecutingPython(true);
    setExecutionDone(false);
    const inputName = excelDataset ? excelDataset.uploadedFile.fileName : 'raw_pos_100k.parquet';
    const totalRows = excelDataset ? excelDataset.summary.totalRows.toLocaleString() : '100,000';
    const missingCount = excelDataset ? excelDataset.summary.missingCount : 2840;
    const negativeCount = excelDataset ? excelDataset.summary.negativeCount : 410;
    const outlierCount = excelDataset ? excelDataset.summary.outlierCount : 2140;
    const pdpaCols = excelDataset?.uploadedFile.detectedErrors.pdpaRiskColumns.join(', ') || 'customerTel & customerName';

    setTerminalLogs([
      `>>> python fresh_food_cleaner.py --input-dataset ${inputName}`,
      '[INFO] Loading pandas 2.2.1, numpy 1.26.4, openpyxl 3.1.2, hashlib...',
      `[INFO] Dataset shape: ${totalRows} rows x ${excelDataset?.uploadedFile.columnNames.length || 12} columns`,
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[STEP 1/5] Handling Missing Data: Imputing ${missingCount} NaN/empty values using Same-Day Mean... Done ✓`,
        `[STEP 2/5] Cleaning Corrupted Negatives: Found ${negativeCount} negative sales records -> Auto-corrected ✓`
      ]);
    }, 700);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[STEP 3/5] Noise Filtering: Calculating 3*IQR on sales volume... Isolated ${outlierCount} Bulk Catering orders to Event Buffer ✓`,
        '[STEP 4/5] Feature Engineering: Generating Payday Factor (25-30, 1-2) and Seasonality Index... Done ✓',
        `[STEP 5/5] PDPA Data Anonymization: Stripping raw [${pdpaCols}]. Computing salted SHA-256 tokens... Done ✓`
      ]);
    }, 1400);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        '[SUCCESS] Python pipeline executed in 1.42s.',
        `>>> Data Quality Score jumped from ${(excelDataset ? (100 - ((missingCount + negativeCount) / (excelDataset.summary.totalRows || 1) * 100)).toFixed(1) : '61.2')}% to 99.8%!`,
        `>>> Cleaned DataFrame saved to clean_${excelDataset ? 'excel' : 'fresh'}_features.parquet`
      ]);
      setIsExecutingPython(false);
      setExecutionDone(true);
      setActiveTab('clean_result');
    }, 2100);
  };

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 03</span>
              <span>•</span>
              <span>การจัดเตรียมข้อมูล</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              การจัดเตรียมข้อมูล & แก้ไขข้อบกพร่องของข้อมูล
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              จัดการข้อมูลสูญหาย กรองคำสั่งซื้อเหมาผิดปกติ สร้างตัวแปรวันเงินเดือนออก คุ้มครองข้อมูลส่วนบุคคล และกำหนดสิทธิ์การเข้าถึงข้อมูลตามบทบาท
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Export Cleaned CSV Button */}
            <button
              onClick={handleExportCleanedCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-sm"
              title="ดาวน์โหลดชุดข้อมูลที่ผ่านการจัดเตรียมแล้วเป็นไฟล์ CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>ส่งออกข้อมูลที่จัดเตรียมแล้ว (CSV)</span>
            </button>

            <button
              onClick={handleRunPython}
              disabled={isExecutingPython}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isExecutingPython ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังประมวลผลข้อมูล...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>▶ เริ่มประมวลผลและแก้ไขข้อมูล</span>
                </>
              )}
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
            <span className="text-[10px] text-emerald-400 font-mono">ส่งออกเรียบร้อย</span>
          </div>
        )}

        {/* 4 Pipeline Quality Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">1. จัดการข้อมูลสูญหาย</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">เติมจากสัปดาห์ก่อน</div>
            <div className="text-[10px] text-slate-500">เติมค่าเฉลี่ยสถิติวันเดียวกัน</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">2. กรองคำสั่งซื้อเหมา</div>
            <div className="font-bold text-amber-400 text-sm mt-0.5">กรองยอดผิดปกติ</div>
            <div className="text-[10px] text-slate-500">แยกคำสั่งซื้อเหมาจัดเบรคออก</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">3. ตัวแปรสภาพแวดล้อม</div>
            <div className="font-bold text-blue-400 text-sm mt-0.5">เงินเดือนออกและสภาพอากาศ</div>
            <div className="text-[10px] text-slate-500">ดัชนีฤดูกาลและเงินเดือนออก</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">4. คุ้มครองข้อมูลส่วนบุคคล</div>
            <div className="font-bold text-purple-400 text-sm mt-0.5">แปลงรหัสลับปกป้องข้อมูล</div>
            <div className="text-[10px] text-slate-500">ตัดเบอร์โทรและชื่อจริง 100%</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('dirty_raw')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'dirty_raw'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>ข้อมูลดิบที่พบข้อบกพร่อง</span>
        </button>

        <button
          onClick={() => setActiveTab('python_code')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'python_code'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>โค้ดประมวลผลข้อมูล</span>
        </button>

        <button
          onClick={() => setActiveTab('clean_result')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'clean_result'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>ผลลัพธ์หลังจัดเตรียมข้อมูลเสร็จสิ้น</span>
          {executionDone && (
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              อัปเดตแล้ว!
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rbac_matrix')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'rbac_matrix'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>การกำหนดสิทธิ์การเข้าถึงข้อมูลตามบทบาท</span>
        </button>
      </div>

      {/* Terminal Output if running */}
      {terminalLogs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 shadow-inner">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 pb-1 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Python 3.11 Runtime Execution Log
            </span>
            <span>Memory: 142MB | Pandas Vectorized</span>
          </div>
          <div className="space-y-1">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('STEP') ? 'text-blue-300' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Dirty Raw Data with Errors */}
      {activeTab === 'dirty_raw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                  {excelDataset 
                    ? `ข้อผิดพลาดที่ตรวจพบจากไฟล์ ${excelDataset.uploadedFile.fileName}`
                    : 'ชุดข้อมูลจำลองที่มีเออเร่อ (Raw Corrupted Input Data)'}
                </h3>
                {excelDataset && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    จากไฟล์ Excel ที่อัปโหลด
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {excelDataset 
                  ? `ตรวจพบค่าว่าง ${excelDataset.summary.missingCount} จุด, ยอดติดลบ ${excelDataset.summary.negativeCount} รายการ, Outlier ${excelDataset.summary.outlierCount} รายการ, คอลัมน์เสี่ยง PDPA ${excelDataset.uploadedFile.detectedErrors.pdpaRiskColumns.length} คอลัมน์`
                  : 'สังเกตค่าว่าง (NaN), ยอดขายติดลบ, ยอดเหมางานสัมมนา (Outlier), และการทำผิดกฎหมาย PDPA (มีเบอร์โทรและชื่อจริงของลูกค้า)'}
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleExportDirtyCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="ส่งออกบันทึกข้อผิดพลาดและข้อมูลที่ตรวจพบเป็นไฟล์ CSV"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>ส่งออก CSV ข้อผิดพลาด</span>
              </button>
              <button
                onClick={handleRunPython}
                disabled={isExecutingPython}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecutingPython ? 'กำลังคลีนซิ่ง...' : 'แก้ข้อผิดพลาดเหล่านี้ด้วย Python'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-rose-500/20">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">ID</th>
                  <th className="px-3.5 py-3">วัน-เวลา</th>
                  <th className="px-3.5 py-3">สินค้า (SKU)</th>
                  <th className="px-3.5 py-3 text-right">ยอดขายดิบ (rawSalesQty)</th>
                  <th className="px-3.5 py-3">ประเภทคำสั่งซื้อ</th>
                  <th className="px-3.5 py-3 text-rose-400">เบอร์โทรลูกค้า (PDPA Risk)</th>
                  <th className="px-3.5 py-3 text-rose-400">ชื่อลูกค้า (PDPA Risk)</th>
                  <th className="px-3.5 py-3">ข้อผิดพลาดที่ตรวจพบ (Errors Detected)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {dirtyRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="px-3.5 py-2.5 font-mono text-slate-400">#{row.id}</td>
                    <td className="px-3.5 py-2.5 text-slate-300">{row.timestamp}</td>
                    <td className="px-3.5 py-2.5 font-medium text-white">{row.sku}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold">
                      {row.rawSalesQty === null ? (
                        <span className="text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded font-mono">NaN (ค่าว่าง)</span>
                      ) : row.rawSalesQty < 0 ? (
                        <span className="text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded font-mono">{row.rawSalesQty} (ติดลบ!)</span>
                      ) : row.rawSalesQty > 200 ? (
                        <span className="text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded font-mono">{row.rawSalesQty} (Bulk Spike)</span>
                      ) : (
                        <span className="text-slate-300 font-mono">{row.rawSalesQty}</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-300">{row.orderType}</td>
                    <td className="px-3.5 py-2.5 font-mono text-rose-300 bg-rose-950/20">
                      {row.customerTel}
                    </td>
                    <td className="px-3.5 py-2.5 text-rose-300 bg-rose-950/20">
                      {row.customerName}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {row.errorTypes.map((err, i) => (
                          <span key={i} className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded font-medium">
                            ⚠️ {err}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Python Code */}
      {activeTab === 'python_code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                สคริปต์ไพธอนสำหรับคลีนซิ่งข้อมูล (Python & Pandas Pipeline)
              </h3>
            </div>
            <button
              onClick={handleRunPython}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>รันสคริปต์นี้เลย</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
              <code>{PYTHON_CLEANSING_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Cleaned Result */}
      {activeTab === 'clean_result' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ผลลัพธ์หลังผ่านกระบวนการคลีนซิ่งด้วย Python (Cleaned & Feature Engineered)
              </h3>
              <p className="text-xs text-slate-400">
                ค่าว่างถูก Impute ด้วยสถิติวันเดียวกันในสัปดาห์ก่อนหน้า, ค่าติดลบถูกแก้, เหมาพิเศษถูกแยกออก, และข้อมูลลูกค้าถูกเข้ารหัส Hash (PDPA Compliant)
              </p>
            </div>
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={handleExportCleanedCsv}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                title="ดาวน์โหลดชุดข้อมูลที่ผ่านการคลีนซิ่งและทำฟีเจอร์แล้วเป็นไฟล์ CSV สำหรับใช้รายงานภายนอก"
              >
                <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                <span>ส่งออกชุดข้อมูล CSV (Export Processed Dataset)</span>
              </button>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
                Score: 99.8%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-emerald-500/20">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">ID</th>
                  <th className="px-3.5 py-3">วัน-เวลา</th>
                  <th className="px-3.5 py-3">สินค้า (SKU)</th>
                  <th className="px-3.5 py-3 text-right">ยอดขายหลังแก้ (salesQty)</th>
                  <th className="px-3.5 py-3">Hashed Customer ID (PDPA)</th>
                  <th className="px-3.5 py-3 text-center">Seasonality Index</th>
                  <th className="px-3.5 py-3 text-center">Payday Factor</th>
                  <th className="px-3.5 py-3">วิธีการคลีนซิ่ง (Cleansed Method)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {cleanRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="px-3.5 py-2.5 font-mono text-slate-400">#{row.id}</td>
                    <td className="px-3.5 py-2.5 text-slate-300">{row.timestamp}</td>
                    <td className="px-3.5 py-2.5 font-medium text-white">{row.sku}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-emerald-400 font-mono">
                      {row.salesQty} หน่วย
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-emerald-300 text-[10px]">
                      {row.hashedCustomerId}
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-300">
                      {row.seasonalityIndex}x
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-300">
                      {row.paydayFactor}x
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                        ✓ {row.cleansedMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: RBAC Matrix */}
      {activeTab === 'rbac_matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                การควบคุมสิทธิ์การเข้าถึงข้อมูลตามลำดับขั้น (Role-Based Access Control - RBAC)
              </h3>
              <p className="text-xs text-slate-400">
                พนักงานหน้าร้านเห็นเฉพาะยอดแนะนำสั่งซื้อ | ฝ่ายจัดซื้อเห็นต้นทุนและซัพพลายเออร์ | Data Scientist เห็นข้อมูลวิจัย
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 pl-2">ทดสอบเปลี่ยนบทบาท:</span>
              <select
                value={currentRole}
                onChange={(e) => onChangeRole(e.target.value as UserRole)}
                className="bg-slate-900 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value="store_manager">พนักงานหน้าร้าน (Store Staff)</option>
                <option value="purchasing">ฝ่ายจัดซื้อ (Purchasing)</option>
                <option value="data_scientist">Data Scientist (โมเดล & โค้ด)</option>
                <option value="executive">ผู้บริหาร (Executive)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${
              currentRole === 'store_manager' ? 'bg-emerald-950/30 border-emerald-500' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                <span>พนักงานหน้าร้าน (Store Staff)</span>
                {currentRole === 'store_manager' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold">Active Role</span>}
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="text-emerald-400">✓ เห็นยอดแนะนำสั่งซื้อประจำวัน (Suggested Order)</li>
                <li className="text-emerald-400">✓ สามารถส่งเหตุผลขอปรับยอด (Override) ได้</li>
                <li className="text-emerald-400">✓ ได้รับการแจ้งเตือน Dynamic Markdown 17:00 น.</li>
                <li className="text-rose-400">✗ ซ่อนข้อมูลราคาทุนจากซัพพลายเออร์</li>
                <li className="text-rose-400">✗ ซ่อนข้อมูลสถิติลึกของโมเดล AI</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              currentRole === 'purchasing' ? 'bg-emerald-950/30 border-emerald-500' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                <span>ฝ่ายจัดซื้อ (Purchasing & Supply Chain)</span>
                {currentRole === 'purchasing' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold">Active Role</span>}
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="text-emerald-400">✓ เห็นต้นทุนสินค้า (Cost Price) และกำไรส่วนเกิน (Margin)</li>
                <li className="text-emerald-400">✓ เห็นรายชื่อซัพพลายเออร์และ Lead Time</li>
                <li className="text-emerald-400">✓ จัดการสร้างและอนุมัติใบสั่งซื้อ (Automated PO)</li>
                <li className="text-emerald-400">✓ ควบคุม Minimum Order Quantity (MOQ)</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              currentRole === 'data_scientist' || currentRole === 'executive' ? 'bg-emerald-950/30 border-emerald-500' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                <span>Data Scientist & ผู้บริหาร</span>
                {(currentRole === 'data_scientist' || currentRole === 'executive') && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold">Active Role</span>}
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300">
                <li className="text-emerald-400">✓ สิทธิ์เต็มเข้าถึงโค้ดไพธอนและโมเดล</li>
                <li className="text-emerald-400">✓ ตรวจสอบข้อมูลดิบ 100,000 แถว และ Feature Store</li>
                <li className="text-emerald-400">✓ ดูค่า MAPE, WAPE, การ Drift ของโมเดล</li>
                <li className="text-emerald-400">✓ ดูรายงาน ROI และกระแสเงินสดคืนทุนโครงการ</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  FileText, 
  ArrowRight, 
  Table, 
  Sparkles,
  ShieldAlert,
  Search,
  RefreshCw
} from 'lucide-react';
import { UploadedExcelFile, CrispStage } from '../types';

interface ExcelUploaderProps {
  onFileUploaded?: (fileData: UploadedExcelFile) => void;
  onNavigateStage?: (stage: CrispStage) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onFileUploaded,
  onNavigateStage,
  isOpenAsModal = false,
  onCloseModal,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedExcelFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process and parse workbook buffer
  const processWorkbook = (workbook: XLSX.WorkBook, fileName: string, fileSize: number) => {
    try {
      const sheetNames = workbook.SheetNames;
      if (sheetNames.length === 0) {
        throw new Error('ไม่พบแผ่นงาน (Sheet) ในไฟล์ Excel นี้');
      }

      const firstSheetName = sheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

      if (jsonData.length === 0) {
        throw new Error('แผ่นงานไม่มีข้อมูลแถว');
      }

      const columnNames = Object.keys(jsonData[0] || {});

      // Scan quality & errors
      let missingCount = 0;
      let negativeCount = 0;
      let outlierCount = 0;
      const pdpaRiskColumns: string[] = [];

      // Check PII in column names or values
      columnNames.forEach(col => {
        const lower = col.toLowerCase();
        if (
          lower.includes('tel') || 
          lower.includes('phone') || 
          lower.includes('เบอร์') || 
          lower.includes('name') || 
          lower.includes('ชื่อ') || 
          lower.includes('citizen') || 
          lower.includes('id_card')
        ) {
          pdpaRiskColumns.push(col);
        }
      });

      jsonData.forEach(row => {
        Object.entries(row).forEach(([col, val]) => {
          if (val === null || val === undefined || val === '' || Number.isNaN(val)) {
            missingCount++;
          }
          if (typeof val === 'number') {
            if (val < 0) negativeCount++;
            if (val > 400 && col.toLowerCase().includes('qty')) outlierCount++;
          }
        });
      });

      const parsedResult: UploadedExcelFile = {
        fileName,
        fileSize,
        sheetNames,
        selectedSheet: firstSheetName,
        rowCount: jsonData.length,
        columnNames,
        sampleData: jsonData,
        detectedErrors: {
          missingCount,
          negativeCount,
          outlierCount,
          pdpaRiskColumns,
        },
        uploadTimestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      setUploadedFile(parsedResult);
      if (onFileUploaded) {
        onFileUploaded(parsedResult);
      }
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel');
      setLoading(false);
    }
  };

  // Handle file selection from input or drop
  const handleFile = (file: File) => {
    setErrorMsg(null);
    setLoading(true);

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMsg('รองรับเฉพาะไฟล์ .xlsx, .xls หรือ .csv เท่านั้น');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        processWorkbook(workbook, file.name, file.size);
      } catch (err: any) {
        setErrorMsg('ไม่สามารถถอดรหัสโครงสร้างไฟล์ Excel ได้: ' + err.message);
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('เกิดข้อผิดพลาดขณะอ่านข้อมูลไฟล์');
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Generate sample rows
  const getSampleRows = () => [
    {
      transaction_id: 'TXN-88001',
      timestamp: '2026-09-10 08:30:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-001',
      sku_name: 'ปลาแซลมอนนอร์เวย์สด (Fresh Norwegian Salmon)',
      category: 'Fresh Food',
      sales_qty: 3,
      unit: 'กก.',
      unit_price: 690,
      total_amount: 2070,
      discount_applied: 0,
      weather: 'Sunny',
      temperature_c: 32.5,
      is_weekend: false,
      customer_name: 'คุณสมชาย วิจิตรศิลป์',
      customer_tel: '081-987-6543'
    },
    {
      transaction_id: 'TXN-88002',
      timestamp: '2026-09-10 09:15:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-003',
      sku_name: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
      category: 'Bakery',
      sales_qty: null, // Intentional missing error
      unit: 'ชิ้น',
      unit_price: 65,
      total_amount: 130,
      discount_applied: 0,
      weather: 'Sunny',
      temperature_c: 33.0,
      is_weekend: false,
      customer_name: 'คุณนภา รัตนเกียรติ',
      customer_tel: '089-123-4567'
    },
    {
      transaction_id: 'TXN-88003',
      timestamp: '2026-09-10 11:45:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-002',
      sku_name: 'เนื้อวัววากิวสันนอกสไลซ์ (A4)',
      category: 'Fresh Food',
      sales_qty: -2, // Intentional negative return error
      unit: 'กก.',
      unit_price: 1650,
      total_amount: -3300,
      discount_applied: 0,
      weather: 'Sunny',
      temperature_c: 34.0,
      is_weekend: false,
      customer_name: 'นางมาลี สุขสม',
      customer_tel: '086-555-4321'
    },
    {
      transaction_id: 'TXN-88004',
      timestamp: '2026-09-10 12:30:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-005',
      sku_name: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
      category: 'Ready-to-eat',
      sales_qty: 600, // Intentional bulk outlier
      unit: 'กล่อง',
      unit_price: 159,
      total_amount: 95400,
      discount_applied: 10,
      weather: 'Rainy',
      temperature_c: 28.0,
      is_weekend: false,
      customer_name: 'บจก. ธนกิจ แคเทอริ่ง',
      customer_tel: '02-777-8888'
    },
    {
      transaction_id: 'TXN-88005',
      timestamp: '2026-09-10 17:10:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-007',
      sku_name: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
      category: 'Dessert',
      sales_qty: 4,
      unit: 'กล่อง',
      unit_price: 95,
      total_amount: 380,
      discount_applied: 30, // 17:00 Yellow sticker discount
      weather: 'Heavy Storm',
      temperature_c: 26.5,
      is_weekend: false,
      customer_name: 'นายกิตติ สันติสุข',
      customer_tel: '095-888-1234'
    },
    {
      transaction_id: 'TXN-88006',
      timestamp: '2026-09-10 18:00:00',
      branch_id: 'BKK-01',
      branch_name: 'สาขาสยามพารากอน',
      sku_id: 'SKU-009',
      sku_name: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
      category: 'Beverage',
      sales_qty: 8,
      unit: 'ขวด',
      unit_price: 65,
      total_amount: 520,
      discount_applied: 0,
      weather: 'Cloudy',
      temperature_c: 29.0,
      is_weekend: false,
      customer_name: 'คุณวราภรณ์ พงษ์เพชร',
      customer_tel: '081-444-9999'
    }
  ];

  // Generate and download a sample realistic Fresh Food POS Excel file
  const handleDownloadSampleTemplate = () => {
    const sampleRows = getSampleRows();
    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'POS_Sales_Transactions');

    // Add metadata sheet
    const metaSheet = XLSX.utils.json_to_sheet([
      { Key: 'System', Value: 'Smart Fresh Food Demand & Waste Reduction System' },
      { Key: 'GeneratedDate', Value: new Date().toISOString() },
      { Key: 'TargetCategories', Value: 'Bakery, Fresh Food, Ready-to-eat, Dessert, Beverage' },
      { Key: 'Note', Value: 'Contains intentional dirty records for Python Cleansing demonstration' }
    ]);
    XLSX.utils.book_append_sheet(wb, metaSheet, 'Data_Catalog');

    XLSX.writeFile(wb, 'fresh_food_pos_sample_template.xlsx');
  };

  // Directly load the sample Excel data into the system
  const handleLoadSampleDirectly = () => {
    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      const sampleRows = getSampleRows();
      const ws = XLSX.utils.json_to_sheet(sampleRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'POS_Sales_Transactions');
      processWorkbook(wb, 'fresh_food_pos_demo.xlsx', 48200);
    }, 400);
  };

  // Filter sample data
  const filteredRows = uploadedFile?.sampleData.filter(row => {
    if (!searchFilter.trim()) return true;
    return Object.values(row).some(v => 
      String(v ?? '').toLowerCase().includes(searchFilter.toLowerCase())
    );
  }) || [];

  const content = (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!uploadedFile && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-emerald-500/60 bg-slate-900/60 hover:bg-slate-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-4 border border-emerald-500/20">
              <UploadCloud className="w-10 h-10 animate-bounce" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              ลากไฟล์ Excel มาวางที่นี่ หรือ <span className="text-emerald-400 underline">คลิกเพื่อเลือกไฟล์</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              รองรับไฟล์ <strong>.xlsx</strong>, <strong>.xls</strong> และ <strong>.csv</strong> รายงานยอดขาย POS, ข้อมูลสต็อกคงคลัง หรือปัจจัยสภาพอากาศ
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-500">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">✓ ตรวจจับข้อผิดพลาดอัตโนมัติ</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">✓ สแกนข้อมูลเสี่ยง PDPA (เบอร์โทร/ชื่อ)</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">✓ ส่งต่อไปยัง Python Cleansing ทันที</span>
            </div>
          </div>

          {/* Quick template button */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">ต้องการทดลองระบบด้วยไฟล์ตัวอย่างของสด?</div>
                <div className="text-[11px] text-slate-400">
                  ดาวน์โหลดไฟล์เทมเพลต หรือกดปุ่มโหลดข้อมูลจำลองเพื่อดูผลลัพธ์ทั่วทั้งเว็บไซต์ได้ทันที
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleLoadSampleDirectly}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                title="นำเข้าข้อมูลจำลองอาหารสดเข้าสู่ระบบเว็บทันทีโดยไม่ต้องอัปโหลดไฟล์"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ โหลดเข้าเว็บทันที</span>
              </button>

              <button
                onClick={handleDownloadSampleTemplate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                title="ดาวน์โหลดไฟล์ .xlsx เพื่อแก้ไขในเครื่องของคุณแล้วนำมาอัปโหลด"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>โหลด .xlsx</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <div className="text-sm font-bold text-white">กำลังถอดรหัสและวิเคราะห์โครงสร้างไฟล์ Excel...</div>
          <div className="text-xs text-slate-400">ระบบกำลังสแกนชีต, คอลัมน์, และตรวจสอบคุณภาพข้อมูลตามระเบียบ CRISP-DM</div>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Parsed File Overview & Quality Audit Dashboard */}
      {uploadedFile && (
        <div className="space-y-4">
          {/* File Header Card */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{uploadedFile.fileName}</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      {(uploadedFile.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    อัปโหลดเมื่อ {uploadedFile.uploadTimestamp} น. • พบ {uploadedFile.sheetNames.length} แผ่นงาน (Sheet) • ทั้งหมด {uploadedFile.rowCount.toLocaleString()} แถว
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>เปลี่ยนไฟล์</span>
                </button>
              </div>
            </div>

            {/* Quality Diagnostic Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">จำนวนแถวทั้งหมด (Rows)</div>
                <div className="text-lg font-bold text-white font-mono">{uploadedFile.rowCount.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 font-medium">พร้อมวิเคราะห์</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">ค่าว่างที่ตรวจพบ (Missing/NaN)</div>
                <div className={`text-lg font-bold font-mono ${uploadedFile.detectedErrors.missingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {uploadedFile.detectedErrors.missingCount} จุด
                </div>
                <div className="text-[10px] text-slate-500">
                  {uploadedFile.detectedErrors.missingCount > 0 ? 'ต้อง Impute ใน Phase 3' : 'สมบูรณ์'}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">ยอดติดลบ & ผิดปกติ (Anomalies)</div>
                <div className={`text-lg font-bold font-mono ${uploadedFile.detectedErrors.negativeCount + uploadedFile.detectedErrors.outlierCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {uploadedFile.detectedErrors.negativeCount + uploadedFile.detectedErrors.outlierCount} รายการ
                </div>
                <div className="text-[10px] text-slate-500">
                  ติดลบ: {uploadedFile.detectedErrors.negativeCount} | Outlier: {uploadedFile.detectedErrors.outlierCount}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">คอลัมน์เสี่ยง PDPA (PII Risk)</div>
                <div className={`text-lg font-bold font-mono ${uploadedFile.detectedErrors.pdpaRiskColumns.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {uploadedFile.detectedErrors.pdpaRiskColumns.length} คอลัมน์
                </div>
                <div className="text-[10px] text-amber-300 truncate" title={uploadedFile.detectedErrors.pdpaRiskColumns.join(', ')}>
                  {uploadedFile.detectedErrors.pdpaRiskColumns.length > 0 ? uploadedFile.detectedErrors.pdpaRiskColumns.join(', ') : 'ปลอดภัย'}
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>ข้อมูลจากไฟล์ Excel นี้พร้อมส่งเข้าสู่ขั้นตอนประมวลผลต่อตาม CRISP-DM</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onNavigateStage && (
                  <>
                    <button
                      onClick={() => {
                        onNavigateStage('data_prep');
                        if (onCloseModal) onCloseModal();
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <span>ส่งไปคลีนซิ่งด้วย Python (Phase 3)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onNavigateStage('modeling');
                        if (onCloseModal) onCloseModal();
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <span>ส่งไปพยากรณ์ AI (Phase 4)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Data Preview Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm">
                  ตัวอย่างข้อมูลจากไฟล์ Excel ({filteredRows.length} แถวที่แสดง)
                </h4>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="ค้นหาข้อความในตาราง..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5 text-slate-500 font-mono text-[11px]">#</th>
                    {uploadedFile.columnNames.map(col => (
                      <th key={col} className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span>{col}</span>
                          {uploadedFile.detectedErrors.pdpaRiskColumns.includes(col) && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded font-bold">PDPA Risk</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredRows.slice(0, 100).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2 text-slate-600 font-mono text-[10px]">{idx + 1}</td>
                      {uploadedFile.columnNames.map(col => {
                        const val = row[col];
                        const isNull = val === null || val === undefined || val === '';
                        const isNegative = typeof val === 'number' && val < 0;
                        const isPdpa = uploadedFile.detectedErrors.pdpaRiskColumns.includes(col);

                        return (
                          <td 
                            key={col} 
                            className={`px-3 py-2 whitespace-nowrap font-mono ${
                              isNull ? 'bg-amber-500/10 text-amber-300 font-bold' :
                              isNegative ? 'bg-rose-500/10 text-rose-300 font-bold' :
                              isPdpa ? 'text-amber-200 bg-amber-950/20' :
                              'text-slate-300'
                            }`}
                          >
                            {isNull ? 'NaN (Missing)' : String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRows.length > 100 && (
              <div className="text-center text-[11px] text-slate-500 pt-1">
                แสดง 100 แถวแรกจากทั้งหมด {filteredRows.length.toLocaleString()} แถว
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // If opened as a modal dialog
  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                อัปโหลดไฟล์ Excel / CSV รายงานยอดขายและสต็อกของสด
              </h3>
            </div>
            {onCloseModal && (
              <button 
                onClick={onCloseModal} 
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1 rounded-lg hover:bg-slate-800"
              >
                ✕ ปิดหน้าต่าง
              </button>
            )}
          </div>

          {content}
        </div>
      </div>
    );
  }

  return content;
};

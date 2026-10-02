import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  Filter, 
  Table, 
  BarChart3, 
  Calendar, 
  CloudSun, 
  CheckCircle2, 
  Sparkles,
  Info,
  ShieldAlert,
  FileSpreadsheet,
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Line,
  ReferenceLine
} from 'recharts';
import { DATA_DICTIONARY, PARETO_WASTE_DATA, DATA_ANOMALIES_DATA } from '../data/mockData';
import { generateSyntheticDataset, SyntheticRecord } from '../data/syntheticDataset';
import { ExcelUploader } from './ExcelUploader';
import { CrispStage, UploadedExcelFile } from '../types';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface DataUnderstandingViewProps {
  onNavigateStage?: (stage: CrispStage) => void;
  excelDataset?: ProcessedExcelSystemData | null;
  onExcelUploaded?: (file: UploadedExcelFile) => void;
  onClearExcelData?: () => void;
}

export const DataUnderstandingView: React.FC<DataUnderstandingViewProps> = ({ 
  onNavigateStage,
  excelDataset,
  onExcelUploaded,
  onClearExcelData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'100k_dataset' | 'data_dictionary' | 'eda_charts' | 'excel_upload' | 'anomaly_and_pareto'>('100k_dataset');
  const [selectedDataSource, setSelectedDataSource] = useState<'excel' | 'synthetic'>(
    excelDataset ? 'excel' : 'synthetic'
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [specialFilter, setSpecialFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sync data source if excel dataset is loaded
  React.useEffect(() => {
    if (excelDataset) {
      setSelectedDataSource('excel');
    }
  }, [excelDataset]);

  // Generate 100,000 rows dataset engine
  const datasetResult = useMemo(() => generateSyntheticDataset(100000), []);
  
  const records = (selectedDataSource === 'excel' && excelDataset) 
    ? excelDataset.records 
    : datasetResult.records;

  const totalRowCount = (selectedDataSource === 'excel' && excelDataset)
    ? excelDataset.summary.totalRows
    : 100000;

  const totalSalesVolume = (selectedDataSource === 'excel' && excelDataset)
    ? excelDataset.summary.totalSalesQty
    : datasetResult.summary.totalSalesVolume;

  const totalRevenueTHB = (selectedDataSource === 'excel' && excelDataset)
    ? excelDataset.summary.totalRevenueTHB
    : datasetResult.summary.totalRevenueTHB;

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = 
        r.skuName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.category.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (r.pdpaHashToken && r.pdpaHashToken.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (r.customerHash && r.customerHash.toLowerCase().includes(searchKeyword.toLowerCase()));
      
      const matchCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
      const matchSpecial = specialFilter === 'ALL' 
        ? true 
        : specialFilter === 'SPECIAL_ONLY' 
          ? r.isSpecialDay 
          : r.hasErrorFixed;

      return matchSearch && matchCategory && matchSpecial;
    });
  }, [records, searchKeyword, categoryFilter, specialFilter]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const displayedRows = filteredRecords.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Hourly pattern chart data
  const hourlyData = [
    { hour: '08:00', sales: 24, label: 'เปิดร้านเช้า' },
    { hour: '09:00', sales: 48, label: 'เตรียมของสด' },
    { hour: '10:00', sales: 85, label: 'ลูกค้าเริ่มเดิน' },
    { hour: '11:00', sales: 168, label: 'ก่อนเที่ยง' },
    { hour: '12:00', sales: 245, label: 'พีคเที่ยง (Lunch Rush)' },
    { hour: '13:00', sales: 190, label: 'บ่ายต้น' },
    { hour: '14:00', sales: 95, label: 'ช่วงบ่าย' },
    { hour: '15:00', sales: 110, label: 'เตรียมสต็อกเย็น' },
    { hour: '16:00', sales: 155, label: 'คนเริ่มเลิกงาน' },
    { hour: '17:00', sales: 280, label: 'พีคเย็น (17:00 Scan)' },
    { hour: '18:00', sales: 310, label: 'พีคสูงสุดเลิกงาน' },
    { hour: '19:00', sales: 260, label: 'Happy Hour Clearance' },
    { hour: '20:00', sales: 140, label: 'ป้ายเหลืองลดราคา' },
    { hour: '21:00', sales: 45, label: 'ปิดร้านเคลียร์ของ' }
  ];

  // Category distribution data
  const categoryData = [
    { name: 'Fresh Food', value: 38, color: '#f87171' },
    { name: 'Bakery', value: 24, color: '#fbbf24' },
    { name: 'Ready-to-eat', value: 18, color: '#f472b6' },
    { name: 'Dessert', value: 12, color: '#a78bfa' },
    { name: 'Beverage', value: 8, color: '#38bdf8' }
  ];

  // Export CSV sample
  const handleExportCSV = () => {
    const headers = ['Row_ID', 'Date', 'Hour', 'SKU', 'Category', 'Sales_Qty', 'Price_THB', 'Total_Amount', 'Weather', 'Is_Special_Day', 'Crowd_Buffer_Pct', 'Hashed_Customer_ID'];
    const csvContent = [
      headers.join(','),
      ...records.slice(0, 100).map(r => 
        [r.rowId, r.date, r.hour, `"${r.skuName}"`, `"${r.category}"`, r.salesQty, r.price, r.totalAmount, r.weather, r.isSpecialDay, r.crowdBufferAppliedPct, r.customerHash].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FreshFood_100k_Sample_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 02</span>
              <span>•</span>
              <span>ทำความเข้าใจข้อมูลและฐานข้อมูล 100,000 รายการ</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              การสำรวจและทำความเข้าใจข้อมูล
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              วิเคราะห์พฤติกรรมการขายจากหน้าร้าน ผสานปัจจัยภายนอก (สภาพอากาศ, วันหยุดนักขัตฤกษ์, ช่วงวันเงินเดือนออก) ผ่านโครงสร้างฐานข้อมูล 100,000 แถว
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('excel_upload')}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>📁 นำเข้าไฟล์ Excel / CSV</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ดาวน์โหลดตัวอย่างข้อมูล (CSV)</span>
            </button>
          </div>
        </div>

        {/* High-Level Statistical Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">จำนวนแถวข้อมูล</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5 font-mono">{totalRowCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">
              {selectedDataSource === 'excel' ? 'จากไฟล์ Excel' : 'รายการขายและสภาพอากาศ'}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">ยอดขายรวม (ชิ้น)</div>
            <div className="text-lg font-extrabold text-white mt-0.5 font-mono">{totalSalesVolume.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">ปริมาณขายทั้งหมด</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">มูลค่ายอดขายรวม</div>
            <div className="text-lg font-extrabold text-blue-400 mt-0.5 font-mono">
              ฿{totalRevenueTHB > 1000000 ? `${(totalRevenueTHB / 1000000).toFixed(2)}M` : Math.round(totalRevenueTHB).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">ยอดขายรวมหน้าร้าน</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">รายการวันพิเศษ / เทศกาล</div>
            <div className="text-lg font-extrabold text-amber-400 mt-0.5 font-mono">{datasetResult.summary.specialDaysCount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">วันเงินเดือนออกและกิจกรรม</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">ตรวจจับคำสั่งซื้อเหมา</div>
            <div className="text-lg font-extrabold text-indigo-400 mt-0.5 font-mono">
              {excelDataset && selectedDataSource === 'excel' ? excelDataset.summary.outlierCount : datasetResult.summary.outliersFilteredCount}
            </div>
            <div className="text-[10px] text-slate-500">คำสั่งซื้อผิดปกติ</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">ลดของเสียอาหารสำเร็จ</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5 font-mono">-28.4%</div>
            <div className="text-[10px] text-emerald-500 font-medium">🎯 บรรลุเป้าหมาย 20-30%</div>
          </div>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveSubTab('100k_dataset')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === '100k_dataset'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>ตารางสำรวจข้อมูล 100,000 แถว</span>
        </button>

        <button
          onClick={() => setActiveSubTab('data_dictionary')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'data_dictionary'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>พจนานุกรมข้อมูลและการคุ้มครองข้อมูลส่วนบุคคล</span>
        </button>

        <button
          onClick={() => setActiveSubTab('eda_charts')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'eda_charts'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>กราฟวิเคราะห์พฤติกรรมการขาย</span>
        </button>

        <button
          onClick={() => setActiveSubTab('excel_upload')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'excel_upload'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>นำเข้าไฟล์ Excel / CSV</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            นำเข้า
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('anomaly_and_pareto')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'anomaly_and_pareto'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>ตรวจสุขภาพข้อมูล & พาเรโต 80/20</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            วิเคราะห์เชิงลึก
          </span>
        </button>
      </div>

      {/* Tab 1: Dataset Table */}
      {activeSubTab === '100k_dataset' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Data Source Switcher Banner if Excel is active */}
          {excelDataset && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">แหล่งข้อมูลที่แสดง:</span>
                <span className="font-semibold text-white">
                  {selectedDataSource === 'excel' ? `ไฟล์ Excel: ${excelDataset.uploadedFile.fileName}` : 'ฐานข้อมูลจำลอง 100,000 แถว'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDataSource('excel');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDataSource === 'excel'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  📊 ไฟล์ Excel ({excelDataset.summary.totalRows.toLocaleString()} แถว)
                </button>
                <button
                  onClick={() => {
                    setSelectedDataSource('synthetic');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDataSource === 'synthetic'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  🗄️ ฐานข้อมูลจำลอง 100k
                </button>
              </div>
            </div>
          )}

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้า, หมวดหมู่, หรือ Hash ลูกค้า..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">หมวดหมู่ทั้งหมด</option>
                <option value="Bakery">Bakery (เบเกอรี่)</option>
                <option value="Fresh Food">Fresh Food (อาหารสด)</option>
                <option value="Ready-to-eat">Ready-to-eat (อาหารพร้อมทาน)</option>
                <option value="Dessert">Dessert (ของหวาน)</option>
                <option value="Beverage">Beverage (เครื่องดื่ม)</option>
              </select>

              <select
                value={specialFilter}
                onChange={(e) => {
                  setSpecialFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">สถานะทั้งหมด</option>
                <option value="SPECIAL_ONLY">เฉพาะวันพิเศษ / มีคนเกิน (Special Surge)</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">Row ID</th>
                  <th className="px-3.5 py-3">วันที่ & เวลา</th>
                  <th className="px-3.5 py-3">สินค้า (SKU)</th>
                  <th className="px-3.5 py-3 text-right">จำนวนขาย (หน่วย)</th>
                  <th className="px-3.5 py-3 text-right">ยอดเงิน (THB)</th>
                  <th className="px-3.5 py-3">สภาพอากาศ</th>
                  <th className="px-3.5 py-3">วันพิเศษ & Crowd Buffer</th>
                  <th className="px-3.5 py-3">Hashed Customer ID (PDPA)</th>
                  <th className="px-3.5 py-3">สถานะคลีนซิ่ง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {displayedRows.map((row) => (
                  <tr key={row.rowId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono text-slate-400">#{row.rowId}</td>
                    <td className="px-3.5 py-2.5 text-slate-300 whitespace-nowrap">
                      {row.date} {String(row.hour).padStart(2, '0')}:00 น.
                    </td>
                    <td className="px-3.5 py-2.5 font-medium text-white whitespace-nowrap">{row.skuName}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-emerald-400">{row.salesQty}</td>
                    <td className="px-3.5 py-2.5 text-right text-slate-300">฿{row.totalAmount.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.weather === 'Sunny' ? 'bg-amber-500/10 text-amber-300' :
                        row.weather === 'Rainy' ? 'bg-blue-500/10 text-blue-300' :
                        'bg-purple-500/10 text-purple-300'
                      }`}>
                        {row.weather}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      {row.isSpecialDay ? (
                        <div className="flex flex-col">
                          <span className="text-[11px] text-amber-300 font-semibold">{row.specialDayNote}</span>
                          <span className="text-[10px] text-emerald-400">Buffer: +{row.crowdBufferAppliedPct}%</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">วันปกติ</span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-[10px] text-slate-400">
                      {row.customerHash}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" />
                        {row.cleanQualityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-slate-400">
            <div>
              กำลังแสดงแถว {(currentPage - 1) * rowsPerPage + 1} ถึง {Math.min(currentPage * rowsPerPage, filteredRecords.length)} จากทั้งหมด {filteredRecords.length} แถว (จากชุดข้อมูล 100,000 แถว)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ย้อนกลับ
              </button>
              <span className="text-slate-300 font-medium">
                หน้า {currentPage} จาก {Math.max(1, totalPages)}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Data Dictionary */}
      {activeSubTab === 'data_dictionary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                พจนานุกรมข้อมูลครบวงจร (Enterprise Data Dictionary)
              </h3>
              <p className="text-xs text-slate-400">
                รวมตัวแปรสำคัญจาก POS, Weather API, Public Calendar และ Feature Store พร้อมระบุระดับความสำคัญและ PDPA
              </p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg">
              {DATA_DICTIONARY.length} ตัวแปรหลัก
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">ชื่อตัวแปร (Field)</th>
                  <th className="px-3.5 py-3">ชื่อภาษาไทย</th>
                  <th className="px-3.5 py-3">ชนิดข้อมูล (Type)</th>
                  <th className="px-3.5 py-3">แหล่งที่มา (Source)</th>
                  <th className="px-3.5 py-3">คำอธิบายการใช้งาน</th>
                  <th className="px-3.5 py-3">ตัวอย่างค่า</th>
                  <th className="px-3.5 py-3">การคุ้มครอง PDPA</th>
                  <th className="px-3.5 py-3">ความสำคัญต่อ AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {DATA_DICTIONARY.map((dict, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="px-3.5 py-2.5 font-mono text-emerald-400 font-bold whitespace-nowrap">{dict.field}</td>
                    <td className="px-3.5 py-2.5 font-medium text-white whitespace-nowrap">{dict.thaiName}</td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-400">{dict.dtype}</td>
                    <td className="px-3.5 py-2.5 text-slate-300 whitespace-nowrap">{dict.source}</td>
                    <td className="px-3.5 py-2.5 text-slate-400 max-w-xs">{dict.description}</td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-300">{dict.sampleValue}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                        dict.pdpaSensitivity.includes('High') ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                        dict.pdpaSensitivity.includes('Medium') ? 'bg-amber-500/10 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {dict.pdpaSensitivity}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-emerald-400 whitespace-nowrap">
                      {dict.businessImportance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: EDA Charts */}
      {activeSubTab === 'eda_charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly Pattern Chart (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  พฤติกรรมยอดขายรายชั่วโมง (Hourly POS Demand Profile)
                </h4>
                <p className="text-xs text-slate-400">
                  สังเกตชัดเจนว่ายอดขายเกิด 2 ช่วงพีค (12:00 น. และ 18:00 น.) ซึ่งเวลา 17:00 น. เป็นจุดสำคัญในการส่งคำสั่ง Dynamic Markdown
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Peak 18:00 น. (310 หน่วย)
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any, item: any) => [`${val} หน่วย (${item.payload.label})`, 'ยอดขายเฉลี่ย']}
                  />
                  <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2 bg-slate-950 py-1.5 rounded-lg">
              <span>🔔 17:00 น. คือเวลาทริกเกอร์ระบบตรวจสต็อกของสด เพื่อแจ้งเตือนโปรโมชั่นลดราคาตอนค่ำ</span>
              <span className="text-amber-400 font-semibold">Critical Checkpoint</span>
            </div>
          </div>

          {/* Category Share (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-1">
              สัดส่วนยอดขายและความเสี่ยงของเสีย (Category Risk Profile)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              กลุ่มเนื้อสัตว์และอาหารทะเลสร้างยอดขายสูงสุดแต่มีมูลค่าสูญเสียเมื่อเน่าเสียสูงที่สุด
            </p>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}% ของยอดขายรวม`, 'สัดส่วน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300">{c.name}</span>
                  <span className="text-slate-500 font-mono ml-auto">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Excel Uploader */}
      {activeSubTab === 'excel_upload' && (
        <ExcelUploader 
          onNavigateStage={onNavigateStage} 
          onFileUploaded={onExcelUploaded}
        />
      )}

      {/* Tab 5: Data Anomaly Health Check & Pareto 80/20 */}
      {activeSubTab === 'anomaly_and_pareto' && (
        <div className="space-y-6">
          
          {/* Section A: Data Quality & Health Check Diagnostics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  การตรวจสุขภาพข้อมูลและความผิดปกติอัตโนมัติ (Data Health & Anomaly Diagnostics)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ระบบตรวจสอบความสมบูรณ์ 100,000 แถวเพื่อค้นหาค่าผิดปกติ, จุดสูญเสียข้อมูล, และความปลอดภัย PDPA
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-4 h-4" />
                สถานะ: พร้อมใช้งานในโมเดล (Verified)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {DATA_ANOMALIES_DATA.map((anomaly) => (
                <div 
                  key={anomaly.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    anomaly.severity === 'critical'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : anomaly.severity === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-emerald-950/20 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {anomaly.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                      {anomaly.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                      {anomaly.severity === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      <span>{anomaly.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      anomaly.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : anomaly.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {anomaly.affectedCount > 0 ? `${anomaly.affectedCount} รายการ` : 'ปกติ 100%'}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {anomaly.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                    <div className="text-slate-400">
                      <span className="text-slate-500">ตัวอย่างตรวจพบ:</span> <span className="font-mono text-slate-300">{anomaly.affectedSample}</span>
                    </div>
                    <div className="text-emerald-400 font-medium">
                      <span className="text-slate-500">แนวทางแก้ไขใน Pipeline:</span> {anomaly.remedyApplied}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Pareto 80/20 Waste Discard Risk Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                    การวิเคราะห์กฎพาเรโต 80/20 มูลค่าของเสีย (Pareto 80/20 Waste Risk)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High ROI Focus
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ระบุสินค้า 20% ที่สร้างความเสียหาย 80% ของมูลค่าทั้งหมด เพื่อโฟกัสการสั่งซื้อ Newsvendor ให้ตรงจุด
                </p>
              </div>
              <div className="text-xs text-slate-400">
                มูลค่าของเสียรวมทั้งระบบ: <span className="text-rose-400 font-bold font-mono">฿483,200 / เดือน</span>
              </div>
            </div>

            {/* Pareto Chart */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">กราฟพาเรโต: มูลค่าของเสียราย SKU (แท่ง) และ % สะสม (เส้น)</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-3 bg-rose-500/80 rounded-sm"></span> มูลค่าขยะทิ้ง (บาท)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <span className="w-3 h-1 bg-amber-400"></span> % สะสม (Cumulative %)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-3 h-0.5 border-t border-dashed border-emerald-400"></span> จุดตัด 80% Cutoff
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={PARETO_WASTE_DATA} margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis 
                      dataKey="skuName" 
                      stroke="#64748b" 
                      tick={{ fontSize: 9 }}
                      angle={-15}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#64748b" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `฿${(v/1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      stroke="#f59e0b" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '11px' }}
                      formatter={(val: any, name: string) => [
                        name === 'cumulativePercentage' ? `${val}%` : `฿${Number(val).toLocaleString()}`,
                        name === 'cumulativePercentage' ? '% ของเสียสะสม' : 'มูลค่าของเสีย (บาท)'
                      ]}
                    />
                    <ReferenceLine yAxisId="right" y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: '80% Pareto Threshold', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }} />
                    <Bar yAxisId="left" dataKey="monthlyWasteCostTHB" name="monthlyWasteCostTHB" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.75} />
                    <Line yAxisId="right" type="monotone" dataKey="cumulativePercentage" name="cumulativePercentage" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pareto Insights Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-amber-300">
                  ข้อค้นพบสำคัญจาก Pareto 80/20: ทำไมนโยบาย AI ถึงคุ้มทุนใน 5 เดือน?
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  สินค้าเพียง <strong>3 รายการแรก</strong> ได้แก่ <em>ปลาแซลมอนนอร์เวย์สด (30.8%)</em>, <em>หมูสามชั้นสไลซ์ชาบู (25.4%)</em> และ <em>ข้าวกล่องแซลมอนย่างซีอิ๊ว (22.2%)</em> รวมกันคิดเป็น <strong>78.4% ของมูลค่าของเสียทั้งระบบ</strong> ทั้งหมดเป็นกลุ่ม <strong>Ultra-Fresh อายุสั้น 1-2 วัน</strong> เมื่อระบบ Newsvendor และ Dynamic Markdown ควบคุม 3 สินค้านี้ได้สำเร็จ มูลค่าของเสียจะลดลงทันทีกว่า ฿360,000/เดือน ส่งผลให้ระบบคืนทุน Payback ได้เร็วกว่ากรอบเดิมถึง 4 เดือน
                </p>
              </div>
            </div>

            {/* Pareto Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2.5">ลำดับ & สินค้า</th>
                    <th className="px-3.5 py-2.5">หมวดหมู่</th>
                    <th className="px-3.5 py-2.5">อายุสินค้า</th>
                    <th className="px-3.5 py-2.5">กลุ่มความสด</th>
                    <th className="px-3.5 py-2.5 text-right">ของเสีย/เดือน (บาท)</th>
                    <th className="px-3.5 py-2.5 text-right">สัดส่วน (%)</th>
                    <th className="px-3.5 py-2.5 text-right">สะสม (%)</th>
                    <th className="px-3.5 py-2.5 text-right text-emerald-400">ประหยัดด้วย AI (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {PARETO_WASTE_DATA.map((item, index) => (
                    <tr key={item.skuName} className="hover:bg-slate-800/40">
                      <td className="px-3.5 py-2.5 font-medium text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                          {index + 1}
                        </span>
                        <span>{item.skuName}</span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-400">{item.category}</td>
                      <td className="px-3.5 py-2.5 font-mono text-slate-300">{item.shelfLifeDays} วัน</td>
                      <td className="px-3.5 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          item.perishabilityTier.includes('1-2')
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {item.perishabilityTier}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-200">
                        ฿{item.monthlyWasteCostTHB.toLocaleString()}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-amber-400">
                        {item.percentageOfTotal}%
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-300">
                        {item.cumulativePercentage}%
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-400">
                        +฿{item.potentialAiSavingTHB.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

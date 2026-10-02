import React from 'react';
import { CrispStage, UserRole, Branch } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  Database, 
  Code2, 
  Cpu, 
  CheckCircle2, 
  Send, 
  LayoutDashboard, 
  Bell, 
  ShieldCheck, 
  FileSpreadsheet,
  Sliders,
  FileText
} from 'lucide-react';

interface HeaderProps {
  currentStage: CrispStage;
  onSelectStage: (stage: CrispStage) => void;
  selectedBranch?: Branch;
  onSelectBranch?: (branch: Branch) => void;
  branches?: Branch[];
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  markdownAlertsCount: number;
  onOpenMarkdownAlerts: () => void;
  crowdBufferPct: number;
  onChangeCrowdBuffer: (val: number) => void;
  onOpenExcelUpload?: () => void;
  activeExcelName?: string;
  onClearActiveExcel?: () => void;
  onOpenSimulator?: () => void;
  onOpenExecutiveReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onSelectStage,
  currentRole,
  onChangeRole,
  markdownAlertsCount,
  onOpenMarkdownAlerts,
  crowdBufferPct,
  onChangeCrowdBuffer,
  onOpenExcelUpload,
  activeExcelName,
  onClearActiveExcel,
  onOpenSimulator,
  onOpenExecutiveReport
}) => {
  const crispStages: { id: CrispStage; label: string; stepNum: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'ภาพรวมระบบ', stepNum: 'HOME', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'business', label: '1. เป้าหมายทางธุรกิจ', stepNum: '01', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'data_understanding', label: '2. ทำความเข้าใจข้อมูล', stepNum: '02', icon: <Database className="w-4 h-4" /> },
    { id: 'data_prep', label: '3. การจัดเตรียมข้อมูล', stepNum: '03', icon: <Code2 className="w-4 h-4" /> },
    { id: 'modeling', label: '4. การสร้างโมเดลพยากรณ์', stepNum: '04', icon: <Cpu className="w-4 h-4" /> },
    { id: 'evaluation', label: '5. การประเมินผลโมเดล', stepNum: '05', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'deployment', label: '6. การนำไปใช้งานจริง', stepNum: '06', icon: <Send className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  ระบบวางแผนอาหารสดและลดขยะอาหาร
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ขั้นตอนมาตรฐาน 6 ขั้นตอน
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ระบบคาดการณ์ความต้องการและลดสินค้าคงเหลือทิ้งสำหรับธุรกิจอาหารสดและเบเกอรี่
              </p>
            </div>
          </div>

          {/* Quick Global Controls: Crowd Buffer, Branch, Role, 17:00 Markdown Bell */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Excess Crowd Buffer Slider */}
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                👥 เผื่อลูกค้ามาเกิน:
              </span>
              <span className="font-bold text-emerald-400 min-w-[36px]">
                +{crowdBufferPct}%
              </span>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={crowdBufferPct}
                onChange={(e) => onChangeCrowdBuffer(Number(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
                title="ปรับเผื่อคนมาเกิน เช่น วันเงินเดือนออก หรือ เทศกาลพิเศษ"
              />
            </div>

            {/* Role Switcher (RBAC Access Control) */}
            <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">สิทธิ์:</span>
              <select
                value={currentRole}
                onChange={(e) => onChangeRole(e.target.value as UserRole)}
                className="bg-transparent text-emerald-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="store_manager" className="bg-slate-800 text-slate-200">
                  พนักงานหน้าร้าน / ผู้จัดการสาขา
                </option>
                <option value="purchasing" className="bg-slate-800 text-slate-200">
                  ฝ่ายจัดซื้อสินค้า
                </option>
                <option value="data_scientist" className="bg-slate-800 text-slate-200">
                  นักวิเคราะห์ข้อมูล
                </option>
                <option value="executive" className="bg-slate-800 text-slate-200">
                  ผู้บริหารระดับสูง
                </option>
              </select>
            </div>

            {/* Excel Upload / Active File Indicator */}
            {activeExcelName ? (
              <div className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[130px]" title={activeExcelName}>
                  ไฟล์: {activeExcelName}
                </span>
                {onClearActiveExcel && (
                  <button
                    onClick={onClearActiveExcel}
                    className="text-slate-400 hover:text-white ml-1 p-0.5 rounded hover:bg-slate-800"
                    title="สลับกลับไปใช้ข้อมูลหลัก 100,000 แถว"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : onOpenExcelUpload && (
              <button
                onClick={onOpenExcelUpload}
                className="flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer shadow-sm"
                title="อัปโหลดไฟล์ Excel (.xlsx, .xls) หรือ CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>นำเข้าไฟล์ Excel</span>
              </button>
            )}

            {/* What-If Simulator Quick Button */}
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="flex items-center space-x-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer shadow-sm"
                title="เปิดเครื่องมือจำลองสถานการณ์ (ฝนตก, เวลาป้ายเหลือง, อัตราส่วนลด)"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>จำลองสถานการณ์</span>
              </button>
            )}

            {/* Executive Summary One-Page Report Button */}
            {onOpenExecutiveReport && (
              <button
                onClick={onOpenExecutiveReport}
                className="flex items-center space-x-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer shadow-sm"
                title="เปิดรายงานสรุปสำหรับผู้บริหาร พร้อมสั่งพิมพ์รายงาน"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>รายงานผู้บริหาร</span>
              </button>
            )}

            {/* Dynamic Markdown Alert Button */}
            <button
              onClick={onOpenMarkdownAlerts}
              className="relative flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer"
              title="ระบบตรวจจับสินค้าสดใกล้หมดอายุเวลา 17:00 น. เพื่อจัดโปรโมชันลดราคาเร่งด่วน"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>แจ้งเตือนลดราคา 17:00 น.</span>
              {markdownAlertsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                  {markdownAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CRISP-DM Process Navigation Bar */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center overflow-x-auto no-scrollbar gap-1.5">
          {crispStages.map((stage) => {
            const isActive = currentStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{stage.icon}</span>
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  Send, 
  Bell, 
  FileCheck, 
  Download, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Store, 
  Truck, 
  Tag,
  CheckCircle,
  Eye,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_POS, MARKDOWN_ALERTS_INITIAL, SKU_LIST, getPerishabilityInfo } from '../data/mockData';
import { PurchaseOrder, MarkdownAlertItem, UserRole } from '../types';
import { ProcessedExcelSystemData } from '../utils/excelDataMapper';

interface DeploymentViewProps {
  currentRole: UserRole;
  markdownAlerts: MarkdownAlertItem[];
  onUpdateMarkdownAlerts: (items: MarkdownAlertItem[]) => void;
  excelDataset?: ProcessedExcelSystemData | null;
}

export const DeploymentView: React.FC<DeploymentViewProps> = ({
  currentRole,
  markdownAlerts,
  onUpdateMarkdownAlerts,
  excelDataset,
}) => {
  const [activeTab, setActiveTab] = useState<'dynamic_markdown' | 'automated_po'>('dynamic_markdown');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(SAMPLE_POS);
  const [selectedPoModal, setSelectedPoModal] = useState<PurchaseOrder | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Sync POs with Excel items
  React.useEffect(() => {
    if (excelDataset && excelDataset.skus.length > 0) {
      const generatedPos: PurchaseOrder[] = excelDataset.skus.slice(0, 5).map((sku, idx) => ({
        poNumber: `PO-XL-${idx + 101}`,
        skuId: sku.id,
        skuName: sku.name,
        branchId: 'B-01',
        branchName: 'สาขาสยามพารากอน (Flagship)',
        supplier: 'Thai Fresh Agrotech Ltd.',
        orderedQty: Math.round(sku.dailyBaseDemand * 1.15),
        unit: sku.unit,
        unitCost: Math.round(sku.costPrice),
        totalAmount: Math.round(sku.dailyBaseDemand * 1.15 * sku.costPrice),
        status: 'Approved by AI',
        createdAt: '16:45 น.',
        dispatchTime: '-'
      }));
      if (generatedPos.length > 0) {
        setPurchaseOrders(generatedPos);
      }
    }
  }, [excelDataset]);

  // Trigger 17:00 Dynamic Markdown Broadcast to POS & Electronic Shelf Labels (ESL)
  const handleBroadcastAllMarkdowns = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    const updated = markdownAlerts.map(item => ({
      ...item,
      posAlertStatus: 'Broadcasted' as const
    }));
    onUpdateMarkdownAlerts(updated);
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 3000);
  };

  // Dispatch all pending POs via EDI
  const handleDispatchAllPOs = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setPurchaseOrders(prev => prev.map(po => ({
        ...po,
        status: 'Dispatched via EDI',
        dispatchTime: '17:05 น. (EDI Connected)'
      })));
      setIsDispatching(false);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Stage Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>ขั้นตอนที่ 06</span>
              <span>•</span>
              <span>การนำไปใช้งานจริง</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              การนำไปใช้งานจริง: ระบบสั่งซื้ออัตโนมัติ & แจ้งเตือนลดราคา 17:00 น.
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              เชื่อมต่อเข้ากับระบบจัดซื้อ ส่งใบสั่งซื้ออัตโนมัติทุกเย็นเวลา 17:00 น. พร้อมระบบตรวจจับสินค้าของสดส่วนเกินเพื่อแจ้งเตือนโปรโมชันลดราคาพิเศษก่อนหมดวัน
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-slate-400">เวลาประมวลผลของระบบ:</span>
              <span className="font-mono font-bold text-emerald-400">17:00:00 น. (รอบส่งคำสั่งซื้อประจำวัน)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('dynamic_markdown')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'dynamic_markdown'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-400" />
          <span>แจ้งเตือนลดราคาสินค้า 17:00 น. (ป้ายเหลือง)</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {markdownAlerts.length} รายการเสี่ยง
          </span>
        </button>

        <button
          onClick={() => setActiveTab('automated_po')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'automated_po'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>ระบบสร้างใบสั่งซื้ออัตโนมัติส่งผู้จัดจำหน่าย</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {purchaseOrders.length} ใบสั่งซื้อ
          </span>
        </button>
      </div>

      {/* Tab 1: 17:00 Dynamic Markdown Alerts */}
      {activeTab === 'dynamic_markdown' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    ระบบสแกนสต็อกของสดคงเหลือเวลา 17:00 น. เพื่อระบายสินค้า (Dynamic Discounting Engine)
                  </h3>
                  <p className="text-xs text-slate-400">
                    หากสต็อกของสด ณ เวลา 17:00 น. มากกว่าเกณฑ์ปลอดภัย ระบบจะแนะนำส่วนลดป้ายเหลืองและบรอดแคสต์ไปยัง POS และป้ายราคาดิจิทัลทันที
                  </p>
                </div>
              </div>

              <button
                onClick={handleBroadcastAllMarkdowns}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>📢 บรอดแคสต์ส่วนลดไปยัง POS ทุกเครื่อง & ESL</span>
              </button>
            </div>

            {broadcastDone && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300 font-medium animate-bounce">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>บรอดแคสต์คำสั่งลดราคาสำเร็จ! หน้าจอแคชเชียร์ POS และป้ายราคาชั้นวาง (ESL) อัปเดตราคาป้ายเหลืองแล้ว</span>
              </div>
            )}

            {/* Markdown Items List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {markdownAlerts.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{item.skuId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.posAlertStatus === 'Broadcasted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300 animate-pulse'
                    }`}>
                      {item.posAlertStatus === 'Broadcasted' ? '✓ บรอดแคสต์แล้ว' : '🔔 รอส่งคำสั่ง'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-white text-sm">{item.skuName}</h4>
                      {(() => {
                        const sku = (excelDataset?.skus || SKU_LIST).find(s => s.id === item.skuId);
                        const pInfo = getPerishabilityInfo(sku?.shelfLifeDays || 2);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${pInfo.badgeColor}`}>
                            {pInfo.tier.split(' ')[0]}
                          </span>
                        );
                      })()}
                    </div>
                    <span className="text-[11px] text-slate-400">{item.category}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div>
                      <span className="text-slate-400 text-[10px]">สต็อก ณ 17:00:</span>
                      <div className="font-bold text-white font-mono">{item.currentStock1700} {item.unit}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">เสี่ยงเน่าเสียส่วนเกิน:</span>
                      <div className="font-bold text-rose-400 font-mono">+{item.excessRiskUnits} {item.unit}</div>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 p-2.5 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-amber-400 font-medium">ส่วนลดป้ายเหลืองที่แนะนำ:</div>
                      <div className="text-lg font-extrabold text-amber-300">
                        ลด {item.recommendedDiscountPct}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 line-through">฿{item.originalPrice}</div>
                      <div className="text-sm font-bold text-white font-mono">
                        ฿{item.discountedPrice.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                    <span>ลดความสูญเสียได้:</span>
                    <span className="font-bold text-emerald-400">+฿{item.wasteLossAvoidedTHB.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Automated Purchase Orders (PO) */}
      {activeTab === 'automated_po' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    ระบบส่งใบสั่งซื้อวัตถุดิบและของสดอัตโนมัติ (Automated EDI Purchase Order Dispatch)
                  </h3>
                  <p className="text-xs text-slate-400">
                    รวบรวมยอดสั่งซื้อที่คำนวณจาก AI และผ่านการตรวจสอบของผู้จัดการ ส่งเข้า ERP และซัพพลายเออร์ตรงเวลา 17:00 น. ของทุกวัน
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDispatchAllPOs}
                  disabled={isDispatching}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatching ? 'กำลังส่งข้อมูล EDI...' : 'ส่งใบสั่งซื้อทั้งหมดไปยังซัพพลายเออร์'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3">เลขที่ PO</th>
                    <th className="px-3.5 py-3">วันที่</th>
                    <th className="px-3.5 py-3">ซัพพลายเออร์ผู้จัดส่ง</th>
                    <th className="px-3.5 py-3">หมวดหมู่</th>
                    <th className="px-3.5 py-3 text-right">จำนวนรายการ</th>
                    <th className="px-3.5 py-3 text-right">ยอดรวมสั่งซื้อ (หน่วย)</th>
                    <th className="px-3.5 py-3 text-right">มูลค่ารวม (THB)</th>
                    <th className="px-3.5 py-3">สถานะ PO</th>
                    <th className="px-3.5 py-3 text-center">ดูรายละเอียด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {purchaseOrders.map((po) => (
                    <tr key={po.poNumber} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3.5 py-3 font-mono font-bold text-emerald-400">{po.poNumber}</td>
                      <td className="px-3.5 py-3 text-slate-300">{po.date}</td>
                      <td className="px-3.5 py-3 font-medium text-white">{po.supplier}</td>
                      <td className="px-3.5 py-3 text-slate-400">{po.category}</td>
                      <td className="px-3.5 py-3 text-right font-mono text-slate-300">{po.itemsCount} รายการ</td>
                      <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-200">{po.totalQty}</td>
                      <td className="px-3.5 py-3 text-right font-mono font-bold text-emerald-400">
                        ฿{po.totalAmountTHB.toLocaleString()}
                      </td>
                      <td className="px-3.5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                          po.status === 'Dispatched via EDI' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          po.status === 'Confirmed by Vendor' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <CheckCircle className="w-3 h-3" />
                          {po.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <button
                          onClick={() => setSelectedPoModal(po)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {selectedPoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-white text-base">ใบสั่งซื้อสินค้าของสด (Purchase Order)</h4>
                <span className="font-mono text-xs text-emerald-400">{selectedPoModal.poNumber}</span>
              </div>
              <button onClick={() => setSelectedPoModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400">ซัพพลายเออร์:</span>
                <div className="font-bold text-white">{selectedPoModal.supplier}</div>
              </div>
              <div>
                <span className="text-slate-400">หมวดหมู่สินค้า:</span>
                <div className="font-bold text-white">{selectedPoModal.category}</div>
              </div>
              <div>
                <span className="text-slate-400">เวลาที่ระบบส่งคำสั่ง:</span>
                <div className="font-mono text-slate-300">{selectedPoModal.dispatchTime}</div>
              </div>
              <div>
                <span className="text-slate-400">มูลค่าคำสั่งซื้อรวม:</span>
                <div className="font-mono font-bold text-emerald-400">฿{selectedPoModal.totalAmountTHB.toLocaleString()}</div>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>คำสั่งซื้อนี้ได้รับการคำนวณและตรวจสอบด้วย AI Inventory Optimizer แล้ว พร้อมส่งถึงฟาร์มและซัพพลายเออร์ตอนเย็น</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPoModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

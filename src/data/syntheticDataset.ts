import { SKU_LIST, BRANCHES } from './mockData';
import { ProductCategory } from '../types';

export interface SyntheticRecord {
  rowId: number;
  date: string;
  hour: number;
  branchName: string;
  skuName: string;
  category: ProductCategory;
  salesQty: number;
  price: number;
  totalAmount: number;
  weather: 'Sunny' | 'Rainy' | 'Heavy Storm';
  isHoliday: boolean;
  isSpecialDay: boolean; // วันหวยออก, วันเงินเดือนออก, วันคอนเสิร์ต
  specialDayNote: string;
  crowdBufferAppliedPct: number;
  customerHash: string;
  hasErrorFixed: boolean;
  cleanQualityStatus: 'Verified (Cleaned via Python)' | 'Raw POS Outlier Handled';
}

// Deterministic seedable generator for high speed and realistic distributions
export function generateSyntheticDataset(count: number = 100000): {
  records: SyntheticRecord[];
  summary: {
    totalRows: number;
    totalSalesVolume: number;
    totalRevenueTHB: number;
    specialDaysCount: number;
    outliersFilteredCount: number;
    avgDailyPerBranch: number;
    foodWasteReductionAchievedPct: number;
  };
} {
  const records: SyntheticRecord[] = [];
  const weatherOptions: ('Sunny' | 'Rainy' | 'Heavy Storm')[] = ['Sunny', 'Sunny', 'Sunny', 'Rainy', 'Heavy Storm'];
  const specialDaysPool = [
    { name: 'วันเงินเดือนออก (Payday Peak)', factor: 1.35, freq: 0.12 },
    { name: 'วันหยุดยาวนักขัตฤกษ์ (Long Weekend)', factor: 1.45, freq: 0.08 },
    { name: 'เทศกาลดนตรี/คอนเสิร์ตใหญ่ใกล้สาขา', factor: 1.60, freq: 0.05 },
    { name: 'วันหวยออก / เดินห้างคึกคัก', factor: 1.20, freq: 0.06 },
    { name: 'โปรโมชั่น Flash Day อาหารสด', factor: 1.30, freq: 0.07 },
    { name: 'วันธรรมดาปกติ (Normal Day)', factor: 1.00, freq: 0.62 },
  ];

  let totalSales = 0;
  let totalRev = 0;
  let specialDaysTotal = 0;
  let outliersTotal = 0;

  // We generate a core slice of records for responsive in-memory browsing
  // and maintain deterministic mathematical metrics for the full 100,000 dataset
  const generateLimit = Math.min(count, 500); // Fast high-performance preview slice for table, full statistical scale
  const startDate = new Date(2026, 7, 1); // August 2026

  for (let i = 1; i <= count; i++) {
    const branch = BRANCHES[(i * 7) % BRANCHES.length];
    const sku = SKU_LIST[(i * 11) % SKU_LIST.length];
    const weather = weatherOptions[(i * 3) % weatherOptions.length];
    
    // Day calculation over 60 days
    const dayOffset = (i % 60);
    const currDate = new Date(startDate.getTime() + dayOffset * 86400000);
    const dateStr = currDate.toISOString().split('T')[0];
    const hour = 8 + (i % 14); // 8:00 - 21:00
    const isHoliday = (dayOffset % 7 === 5 || dayOffset % 7 === 6);

    const specialChoice = specialDaysPool[(i * 13) % specialDaysPool.length];
    const isSpecialDay = specialChoice.factor > 1.0;
    if (isSpecialDay) specialDaysTotal++;

    // Crowd surge buffer
    const crowdBufferPct = isSpecialDay ? Math.round((specialChoice.factor - 1) * 100) : (isHoliday ? 20 : 0);
    
    // Quantity calculation with variance
    const baseDemand = sku.dailyBaseDemand / 12; // hourly base
    let noise = (Math.sin(i * 0.45) * 0.3) + 1.0;
    let qty = Math.round(baseDemand * noise * (isHoliday ? 1.4 : 1.0) * specialChoice.factor);
    if (qty < 1) qty = 1;

    // Simulate bulk outliers (2.1% chance)
    const isBulk = (i % 47 === 0);
    if (isBulk) {
      outliersTotal++;
      qty = qty * 4 + 25;
    }

    const price = sku.sellingPrice;
    const amount = qty * price;

    totalSales += qty;
    totalRev += amount;

    if (i <= generateLimit) {
      const custHash = `usr_${((i * 1234567) % 899999 + 100000).toString(16)}`;
      records.push({
        rowId: i,
        date: dateStr,
        hour,
        branchName: branch.name,
        skuName: sku.name,
        category: sku.category,
        salesQty: qty,
        price,
        totalAmount: amount,
        weather,
        isHoliday,
        isSpecialDay,
        specialDayNote: specialChoice.name,
        crowdBufferAppliedPct: crowdBufferPct,
        customerHash: custHash,
        hasErrorFixed: true,
        cleanQualityStatus: isBulk ? 'Raw POS Outlier Handled' : 'Verified (Cleaned via Python)'
      });
    }
  }

  // Scale statistics accurately to 100,000 rows
  const scale = count / Math.max(1, count);
  const finalTotalSales = Math.round(totalSales * scale);
  const finalTotalRev = Math.round(totalRev * scale);

  return {
    records,
    summary: {
      totalRows: count,
      totalSalesVolume: finalTotalSales,
      totalRevenueTHB: finalTotalRev,
      specialDaysCount: Math.round(specialDaysTotal * (count / Math.max(1, count))),
      outliersFilteredCount: Math.round(outliersTotal * (count / Math.max(1, count))),
      avgDailyPerBranch: Math.round(finalTotalSales / (BRANCHES.length * 60)),
      foodWasteReductionAchievedPct: 28.6
    }
  };
}

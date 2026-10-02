export type CrispStage = 
  | 'overview' 
  | 'business' 
  | 'data_understanding' 
  | 'data_prep' 
  | 'modeling' 
  | 'evaluation' 
  | 'deployment';

export type UserRole = 'store_manager' | 'purchasing' | 'data_scientist' | 'executive';

export type ProductCategory = 
  | 'Bakery'
  | 'Fresh Food'
  | 'Ready-to-eat'
  | 'Dessert'
  | 'Beverage';

export interface Branch {
  id: string;
  name: string;
  location: string;
  type: 'Flagship' | 'Supermarket' | 'Express';
  avgDailyCustomers: number;
}

export interface SKU {
  id: string;
  name: string;
  nameEn: string;
  category: ProductCategory;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  shelfLifeDays: number;
  supplier: string;
  dailyBaseDemand: number;
}

export interface DataDictionaryEntry {
  field: string;
  thaiName: string;
  dtype: 'float64' | 'int64' | 'string' | 'datetime' | 'boolean';
  source: 'POS หน้าร้าน' | 'Weather API' | 'Public Calendar' | 'ERP / ซัพพลายเออร์' | 'Feature Store';
  description: string;
  sampleValue: string;
  pdpaSensitivity: 'High (PII - ต้องตัด/Hash)' | 'Medium (Internal)' | 'Low (Public/General)';
  businessImportance: 'สูงมาก (Core Target/Feature)' | 'สูง' | 'ปานกลาง';
}

export interface RawDirtyRow {
  id: number;
  timestamp: string;
  branch: string;
  sku: string;
  category: string;
  rawSalesQty: number | null; // may be null or negative
  price: number;
  weather: 'Sunny' | 'Rainy' | 'Heavy Storm';
  temperature: number;
  isHoliday: boolean;
  customerTel: string; // PII error
  customerName: string; // PII error
  orderType: 'Walk-in' | 'Bulk Catering' | 'Delivery';
  isCorrupted: boolean;
  errorTypes: string[];
}

export interface CleanRow {
  id: number;
  timestamp: string;
  branch: string;
  sku: string;
  category: string;
  salesQty: number;
  price: number;
  weather: string;
  temperature: number;
  isHoliday: boolean;
  hashedCustomerId: string; // Anonymized
  isBulkOutlier: boolean;
  seasonalityIndex: number;
  paydayFactor: number;
  cleansedMethod: string;
}

export interface ForecastPoint {
  date: string;
  dayName: string;
  actualDemand?: number;
  baselineOrder: number; // Rule of thumb (old method)
  predictedDemand: number; // AI model (LightGBM/Prophet)
  lowerBound: number; // 80% CI
  upperBound: number; // 80% CI
  weather: 'Sunny' | 'Rainy' | 'Heavy Storm';
  isPayday: boolean;
  specialEvent?: string;
  surgeCrowdBufferPct: number;
  recommendedOrder: number;
}

export interface InventoryOptimizationItem {
  id: string;
  skuName: string;
  skuId: string;
  category: ProductCategory;
  unit: string;
  unitCost: number;
  sellingPrice: number;
  currentStock: number;
  aiPredictedDemand: number;
  underageCost: number; // Profit margin lost per unit if stockout
  overageCost: number; // Cost of unsold unit perishing
  criticalRatio: number; // Cu / (Cu + Co)
  optimalOrderQty: number; // Linear programming / Newsvendor result
  safetyMinFloor: number;
  safetyMaxCeiling: number;
  suggestedPoQty: number;
  managerOverrideQty?: number;
  overrideReason?: string;
  status: 'Auto-Approved' | 'Modified by Manager' | 'Pending Review';
}

export interface MarkdownAlertItem {
  id: string;
  skuId: string;
  skuName: string;
  category: ProductCategory;
  unit: string;
  originalPrice: number;
  currentStock1700: number;
  safeRemainingThreshold: number;
  projectedEveningSales: number;
  excessRiskUnits: number;
  recommendedDiscountPct: number;
  discountedPrice: number;
  wasteLossAvoidedTHB: number;
  posAlertStatus: 'Active' | 'Broadcasted' | 'Sold Out';
  timeTrigger: string;
}

export interface PurchaseOrder {
  poNumber: string;
  date: string;
  branch: string;
  supplier: string;
  category: string;
  itemsCount: number;
  totalQty: number;
  totalAmountTHB: number;
  status: 'Generated (17:00)' | 'Dispatched via EDI' | 'Confirmed by Vendor';
  dispatchTime: string;
}

export interface BreakEvenParams {
  monthlyFreshInventoryCost: number; // e.g. 2,000,000 THB
  currentWastePct: number; // e.g. 12%
  targetReductionPct: number; // e.g. 25%
  monthlyCloudServerCost: number; // e.g. 25,000 THB
  monthlyMaintenanceCost: number; // e.g. 15,000 THB
  oneTimeSetupCost: number; // e.g. 240,000 THB
  stockoutRevenueRecoveryPct: number; // e.g. 3% boost in fulfilled sales
}

export type PerishabilityTier = 'Ultra-Fresh (1-2 วัน)' | 'Short Shelf-Life (3-5 วัน)' | 'Medium (7+ วัน)';

export interface PerishabilityInfo {
  tier: PerishabilityTier;
  riskLevel: 'วิกฤตสูงสุด (Critical)' | 'เฝ้าระวังสูง (High)' | 'ปานกลาง (Medium)';
  badgeColor: string;
  recommendedAction: string;
}

export interface ParetoWasteItem {
  skuName: string;
  category: string;
  shelfLifeDays: number;
  perishabilityTier: PerishabilityTier;
  monthlyWasteCostTHB: number;
  percentageOfTotal: number;
  cumulativePercentage: number;
  unitsDiscarded: number;
  potentialAiSavingTHB: number;
}

export interface DataAnomalyItem {
  id: string;
  type: 'zero_sales_streak' | 'margin_inversion' | 'missing_null' | 'outlier_spike' | 'pdpa_pii_flag';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  affectedCount: number;
  affectedSample: string;
  remedyApplied: string;
}

export interface UploadedExcelFile {
  fileName: string;
  fileSize: number;
  sheetNames: string[];
  selectedSheet: string;
  rowCount: number;
  columnNames: string[];
  sampleData: Record<string, any>[];
  detectedErrors: {
    missingCount: number;
    negativeCount: number;
    outlierCount: number;
    pdpaRiskColumns: string[];
  };
  uploadTimestamp: string;
}

export interface ScenarioSimulationParams {
  weatherCondition: 'Sunny' | 'Light Rain' | 'Heavy Monsoon Storm';
  eveningTrafficShiftPct: number;
  markdownStartTime: '16:00' | '17:00' | '18:00';
  discountPct: number;
  crowdBufferPct: number;
  isSpecialPayday: boolean;
}

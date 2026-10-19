export type CrispStage = 
  | 'overview'            // เมนูที่ 1: Dashboard ภาพรวม
  | 'data_prep'           // เมนูที่ 2: Data Understanding & Preparation
  | 'forecasting'         // เมนูที่ 3: AI Demand Forecasting
  | 'modeling'            // เมนูที่ 4: Modeling
  | 'evaluation'          // เมนูที่ 5: Evaluation
  | 'inventory_waste';    // เมนูที่ 6: Inventory & Food Waste Management

export type UserRole = 'store_manager' | 'purchasing' | 'data_scientist' | 'executive';

export interface ModelExperimentResult {
  modelName: string;
  modelType: 'Linear Regression' | 'Random Forest Regressor' | 'LightGBM Regressor';
  trainingDataInfo: string;
  testingDataInfo: string;
  hyperparameters: Record<string, any>;
  trainingStatus: 'ฝึกสำเร็จ (Ready)' | 'กำลังฝึก (Training)' | 'ยังไม่ฝึก';
  trainingTimeSec: number;
  mae: number;
  rmse: number;
  mapePct: number;
  r2Score: number;
  highlight: string;
}

export interface UserOverrideLog {
  id: string;
  timestamp: string;
  skuName: string;
  originalRecommendedQty: number;
  overriddenQty: number;
  reason: string;
  operator: string;
}

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

export interface AIClusterGroup {
  id: string;
  name: string;
  clusterType: 'perishability' | 'velocity' | 'demand_pattern' | 'channel';
  badgeColor: string;
  count: number;
  skus: string[];
  description: string;
  riskLevel: 'สูงมาก' | 'สูง' | 'ปานกลาง' | 'ต่ำ';
  recommendedStrategy: string;
  recommendedModel: string;
  avgDailySales: number;
}

export interface AIColumnRole {
  column: string;
  detectedType: string;
  role: 'Target Y (ยอดขาย)' | 'Date/Time (เวลา)' | 'Category/Group (หมวด)' | 'Numeric Feature (ตัวเลข)' | 'Identifier (รหัส)' | 'PII/Sensitive (ข้อมูลส่วนตัว)' | 'Other (ทั่วไป)';
  confidence: number;
  imputationAdvice: string;
  sampleValue: string;
}

export interface AIAutoClassificationReport {
  timestamp: string;
  detectedColumns: AIColumnRole[];
  clusters: AIClusterGroup[];
  overallDataHealthScore: number;
  aiInsights: string[];
}


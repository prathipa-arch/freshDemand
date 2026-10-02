import { 
  SKU, 
  Branch, 
  DataDictionaryEntry, 
  RawDirtyRow, 
  CleanRow, 
  MarkdownAlertItem, 
  PurchaseOrder, 
  InventoryOptimizationItem,
  ParetoWasteItem,
  DataAnomalyItem,
  PerishabilityInfo,
  PerishabilityTier
} from '../types';

export const BRANCHES: Branch[] = [
  { id: 'BKK-01', name: 'สาขาสยามพารากอน (Flagship)', location: 'กรุงเทพฯ (ปทุมวัน)', type: 'Flagship', avgDailyCustomers: 14500 },
  { id: 'BKK-02', name: 'สาขาเซ็นทรัลลาดพร้าว', location: 'กรุงเทพฯ (จตุจักร)', type: 'Supermarket', avgDailyCustomers: 9200 },
  { id: 'CNX-01', name: 'สาขาเชียงใหม่ นิมมาน', location: 'เชียงใหม่', type: 'Supermarket', avgDailyCustomers: 6400 },
  { id: 'HKT-01', name: 'สาขาภูเก็ต ป่าตอง', location: 'ภูเก็ต', type: 'Flagship', avgDailyCustomers: 8800 },
  { id: 'KKN-01', name: 'สาขาขอนแก่น มหาวิทยาลัย', location: 'ขอนแก่น', type: 'Express', avgDailyCustomers: 5100 },
];

export const SKU_LIST: SKU[] = [
  {
    id: 'SKU-001',
    name: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    nameEn: 'Fresh Norwegian Salmon Fillet',
    category: 'Fresh Food',
    unit: 'กก.',
    costPrice: 480,
    sellingPrice: 690,
    shelfLifeDays: 2,
    supplier: 'บจก. สยามซีฟู้ด อินเตอร์ฯ',
    dailyBaseDemand: 45
  },
  {
    id: 'SKU-002',
    name: 'เนื้อวัววากิวสันนอกสไลซ์ (A4)',
    nameEn: 'Wagyu Beef Striploin A4',
    category: 'Fresh Food',
    unit: 'กก.',
    costPrice: 1100,
    sellingPrice: 1650,
    shelfLifeDays: 3,
    supplier: 'พรีเมียม บีฟ เทรดดิ้ง',
    dailyBaseDemand: 22
  },
  {
    id: 'SKU-003',
    name: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    nameEn: 'Artisan Butter Croissant',
    category: 'Bakery',
    unit: 'ชิ้น',
    costPrice: 28,
    sellingPrice: 65,
    shelfLifeDays: 1,
    supplier: 'ครัวเบเกอรี่กลาง สาขาหลัก',
    dailyBaseDemand: 160
  },
  {
    id: 'SKU-004',
    name: 'ขนมปังซาวโดว์ธรรมชาติ (Sourdough Loaf)',
    nameEn: 'Natural Sourdough Bread',
    category: 'Bakery',
    unit: 'แถว',
    costPrice: 55,
    sellingPrice: 140,
    shelfLifeDays: 2,
    supplier: 'ครัวเบเกอรี่กลาง สาขาหลัก',
    dailyBaseDemand: 38
  },
  {
    id: 'SKU-005',
    name: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    nameEn: 'Grilled Salmon Bento Box',
    category: 'Ready-to-eat',
    unit: 'กล่อง',
    costPrice: 85,
    sellingPrice: 159,
    shelfLifeDays: 1,
    supplier: 'เซ็นทรัล คิตเช่น เดลี่',
    dailyBaseDemand: 85
  },
  {
    id: 'SKU-006',
    name: 'หมูสามชั้นสไลซ์ชาบู สด',
    nameEn: 'Fresh Pork Belly Shabu Slice',
    category: 'Fresh Food',
    unit: 'กก.',
    costPrice: 155,
    sellingPrice: 245,
    shelfLifeDays: 2,
    supplier: 'ฟาร์มสุกรไทยมาตรฐานสากล',
    dailyBaseDemand: 68
  },
  {
    id: 'SKU-007',
    name: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    nameEn: 'Mango Sticky Rice with Coconut Milk',
    category: 'Dessert',
    unit: 'กล่อง',
    costPrice: 45,
    sellingPrice: 95,
    shelfLifeDays: 1,
    supplier: 'ครัวขนมไทยทองเอก',
    dailyBaseDemand: 75
  },
  {
    id: 'SKU-008',
    name: 'ชิฟฟ่อนเค้กมะพร้าวอ่อนสด',
    nameEn: 'Fresh Young Coconut Chiffon Cake',
    category: 'Dessert',
    unit: 'กล่อง',
    costPrice: 50,
    sellingPrice: 110,
    shelfLifeDays: 2,
    supplier: 'ครัวเบเกอรี่กลาง สาขาหลัก',
    dailyBaseDemand: 55
  },
  {
    id: 'SKU-009',
    name: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
    nameEn: 'Artisan Thai Milk Tea Cold Brew',
    category: 'Beverage',
    unit: 'ขวด',
    costPrice: 25,
    sellingPrice: 65,
    shelfLifeDays: 3,
    supplier: 'คาเฟ่ บาริสต้า ฮับ',
    dailyBaseDemand: 120
  },
  {
    id: 'SKU-010',
    name: 'น้ำส้มสายน้ำผึ้งคั้นสด 100%',
    nameEn: 'Fresh Honey Orange Juice 100%',
    category: 'Beverage',
    unit: 'ขวด',
    costPrice: 35,
    sellingPrice: 85,
    shelfLifeDays: 2,
    supplier: 'ฟาร์มส้มเชียงใหม่ กรีนเวลล์',
    dailyBaseDemand: 90
  }
];

export const DATA_DICTIONARY: DataDictionaryEntry[] = [
  {
    field: 'transaction_id',
    thaiName: 'รหัสรายการขาย POS',
    dtype: 'string',
    source: 'POS หน้าร้าน',
    description: 'รหัสอ้างอิงใบเสร็จขายที่เคาน์เตอร์แคชเชียร์หรือ Self-checkout',
    sampleValue: 'TX-20260910-88412',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'timestamp',
    thaiName: 'วันและเวลาที่บันทึก',
    dtype: 'datetime',
    source: 'POS หน้าร้าน',
    description: 'เวลาเกิดยอดขายรายชั่วโมง ใช้คำนวณ Intraday Peak & Seasonality',
    sampleValue: '2026-09-10 11:42:15',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'branch_id',
    thaiName: 'รหัสสาขา',
    dtype: 'string',
    source: 'ERP / ซัพพลายเออร์',
    description: 'รหัสสาขาของร้านค้า (เช่น BKK-01 สยามพารากอน)',
    sampleValue: 'BKK-01',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'sku_id',
    thaiName: 'รหัสสินค้า',
    dtype: 'string',
    source: 'ERP / ซัพพลายเออร์',
    description: 'รหัสเฉพาะของสินค้าของสดแต่ละชนิด',
    sampleValue: 'SKU-001',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'sales_quantity',
    thaiName: 'จำนวนหน่วยที่ขายได้ (Target Y)',
    dtype: 'float64',
    source: 'POS หน้าร้าน',
    description: 'ยอดขายจริง ณ เวลาที่กำหนด เป็นตัวแปรเป้าหมายในการทำนาย',
    sampleValue: '14.50 (กก./ชิ้น)',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'unit_price',
    thaiName: 'ราคาขายต่อหน่วย',
    dtype: 'float64',
    source: 'POS หน้าร้าน',
    description: 'ราคาขายปกติ ณ เวลานั้นๆ',
    sampleValue: '690.00 THB',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'discount_pct',
    thaiName: 'เปอร์เซ็นต์ส่วนลดหรือโปรโมชั่น',
    dtype: 'float64',
    source: 'POS หน้าร้าน',
    description: 'ส่วนลดโปรโมชั่นช่วงปกติ หรือโปรลดล้างสต็อกตอนค่ำ',
    sampleValue: '25.0 %',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'weather_condition',
    thaiName: 'สภาพอากาศ',
    dtype: 'string',
    source: 'Weather API',
    description: 'สภาพอากาศขณะนั้น (Sunny, Rainy, Stormy) ส่งผลต่อ Traffic เดินห้าง',
    sampleValue: 'Rainy (ฝนตกหนัก)',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'rainfall_mm',
    thaiName: 'ปริมาณน้ำฝนสะสม (มม.)',
    dtype: 'float64',
    source: 'Weather API',
    description: 'ฝนตกหนักมักลดคนเดินหน้าร้าน แต่เพิ่ม Delivery',
    sampleValue: '42.8 mm',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'ปานกลาง'
  },
  {
    field: 'temperature_c',
    thaiName: 'อุณหภูมิ (°C)',
    dtype: 'float64',
    source: 'Weather API',
    description: 'อุณหภูมิเฉลี่ย มีผลต่อความต้องการเครื่องดื่ม/ของสด',
    sampleValue: '32.5 °C',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'ปานกลาง'
  },
  {
    field: 'is_holiday',
    thaiName: 'วันหยุดนักขัตฤกษ์ / เสาร์-อาทิตย์',
    dtype: 'boolean',
    source: 'Public Calendar',
    description: 'ระบุว่าเป็นวันหยุดยาว หรือ Weekend ที่ยอดขายของสดพุ่งสูงกว่าปกติ 40-70%',
    sampleValue: 'True',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'nearby_event_flag',
    thaiName: 'อีเวนต์หรือคอนเสิร์ตใกล้เคียง',
    dtype: 'string',
    source: 'Public Calendar',
    description: 'เช่น งานสัปดาห์หนังสือ, งานคอนเสิร์ตพารากอนฮอลล์, เทศกาลเจ',
    sampleValue: 'Festival / Concert',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'customer_tel_raw',
    thaiName: 'เบอร์โทรศัพท์ลูกค้า (ก่อนคลีนซิ่ง)',
    dtype: 'string',
    source: 'POS หน้าร้าน',
    description: 'ข้อมูลสมาชิกลูกค้า (เป็น PII ผิดกฎหมาย PDPA ต้องแปลงเป็น Hash)',
    sampleValue: '081-992-3411',
    pdpaSensitivity: 'High (PII - ต้องตัด/Hash)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'customer_name_raw',
    thaiName: 'ชื่อ-นามสกุลลูกค้า (ก่อนคลีนซิ่ง)',
    dtype: 'string',
    source: 'POS หน้าร้าน',
    description: 'ข้อมูลส่วนบุคคลระบุตัวตน ต้องตัดทิ้ง (Anonymize)',
    sampleValue: 'นายสมชาย รัตนวงศ์',
    pdpaSensitivity: 'High (PII - ต้องตัด/Hash)',
    businessImportance: 'สูง'
  },
  {
    field: 'customer_id_hashed',
    thaiName: 'รหัสลูกค้าแบบนิรนาม (PDPA Compliant)',
    dtype: 'string',
    source: 'Feature Store',
    description: 'SHA-256 Salted Hash สำหรับวิเคราะห์พฤติกรรมลูกค้าประจำโดยไม่ละเมิด PDPA',
    sampleValue: 'c8f41e0b82f9a...3d',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  },
  {
    field: 'is_bulk_order',
    thaiName: 'คำสั่งซื้อเหมาพิเศษ (Outlier Flag)',
    dtype: 'boolean',
    source: 'Feature Store',
    description: 'คำสั่งซื้อเกิน 3 IQR หรือ Z-score > 3.0 เช่น งานจัดเลี้ยงบริษัท ต้องตัดออกจาก Baseline โมเดล',
    sampleValue: 'False',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'payday_effect_factor',
    thaiName: 'ดัชนีวันเงินเดือนออก (Payday Index)',
    dtype: 'float64',
    source: 'Feature Store',
    description: 'คำนวณจากวันที่ 25-30 และ 1-3 ของทุกเดือน ซึ่งลูกค้าซื้อเนื้อพรีเมียมเพิ่ม 1.35x',
    sampleValue: '1.28',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'seasonality_index',
    thaiName: 'ดัชนีฤดูกาลรายสัปดาห์ (Seasonality)',
    dtype: 'float64',
    source: 'Feature Store',
    description: 'สัดส่วนยอดขายเปรียบเทียบกับค่าเฉลี่ยทั้งสัปดาห์ (จันทร์=0.82, อาทิตย์=1.45)',
    sampleValue: '1.38',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'shelf_life_remaining_hours',
    thaiName: 'อายุการเก็บรักษาคงเหลือ (ชม.)',
    dtype: 'float64',
    source: 'ERP / ซัพพลายเออร์',
    description: 'ชั่วโมงที่เหลือก่อนสินค้าของสดจะหมดอายุและต้องทิ้งเป็น Food Waste',
    sampleValue: '7.5 hours',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูงมาก (Core Target/Feature)'
  },
  {
    field: 'food_waste_cost_thb',
    thaiName: 'มูลค่าขยะที่ทิ้ง (THB)',
    dtype: 'float64',
    source: 'ERP / ซัพพลายเออร์',
    description: 'จำนวนสินค้าที่เหลือขายไม่ทันคูณด้วยราคาทุน (Loss per unit)',
    sampleValue: '3,840.00 THB',
    pdpaSensitivity: 'Low (Public/General)',
    businessImportance: 'สูง'
  }
];

export const DIRTY_DATA_SAMPLE: RawDirtyRow[] = [
  {
    id: 1001,
    timestamp: '2026-09-03 08:30:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    category: 'Fresh Food',
    rawSalesQty: 12.5,
    price: 690,
    weather: 'Sunny',
    temperature: 31,
    isHoliday: false,
    customerTel: '081-992-3411',
    customerName: 'คุณสมชาย รัตนวงศ์',
    orderType: 'Walk-in',
    isCorrupted: true,
    errorTypes: ['PDPA Violation (โทรศัพท์/ชื่อเปิดเผย)']
  },
  {
    id: 1002,
    timestamp: '2026-09-03 09:15:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    category: 'Bakery',
    rawSalesQty: null, // Missing value due to POS freeze
    price: 65,
    weather: 'Sunny',
    temperature: 31,
    isHoliday: false,
    customerTel: '089-445-1288',
    customerName: 'คุณวราภรณ์ สุขใจ',
    orderType: 'Walk-in',
    isCorrupted: true,
    errorTypes: ['Missing Data (NaN จากระบบ POS แฮงค์)']
  },
  {
    id: 1003,
    timestamp: '2026-09-03 10:20:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'เนื้อวัววากิวสันนอกสไลซ์ (A4)',
    category: 'Fresh Food',
    rawSalesQty: -8.0, // Negative glitch
    price: 1650,
    weather: 'Rainy',
    temperature: 28,
    isHoliday: false,
    customerTel: '092-331-5900',
    customerName: 'คุณศุภชัย กิตติคุณ',
    orderType: 'Walk-in',
    isCorrupted: true,
    errorTypes: ['Negative Value (ยอดขายติดลบ -8 กก.)']
  },
  {
    id: 1004,
    timestamp: '2026-09-03 11:45:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    category: 'Dessert',
    rawSalesQty: 150.0, // Bulk catering anomaly
    price: 95,
    weather: 'Sunny',
    temperature: 33,
    isHoliday: false,
    customerTel: '085-771-0022',
    customerName: 'บริษัท กสทช. คอนเฟอเรนซ์',
    orderType: 'Bulk Catering',
    isCorrupted: true,
    errorTypes: ['Extreme Outlier (เหมาจัดเลี้ยง 150 กล่อง ไม่ใช่ยอดปกติ)']
  },
  {
    id: 1005,
    timestamp: '2026-09-03 12:30:00',
    branch: 'สาขาเซ็นทรัลลาดพร้าว',
    sku: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    category: 'Ready-to-eat',
    rawSalesQty: 18.0,
    price: 159,
    weather: 'Heavy Storm',
    temperature: 26,
    isHoliday: false,
    customerTel: '061-884-2199',
    customerName: 'คุณนภัสสร เมธา',
    orderType: 'Walk-in',
    isCorrupted: true,
    errorTypes: ['PDPA Violation (โทรศัพท์/ชื่อเปิดเผย)']
  },
  {
    id: 1006,
    timestamp: '2026-09-03 14:10:00',
    branch: 'สาขาเชียงใหม่ นิมมาน',
    sku: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
    category: 'Beverage',
    rawSalesQty: null, // Store closed due to power trip
    price: 65,
    weather: 'Rainy',
    temperature: 27,
    isHoliday: false,
    customerTel: '083-112-9900',
    customerName: 'คุณพัชรี เลิศล้ำ',
    orderType: 'Walk-in',
    isCorrupted: true,
    errorTypes: ['Missing Data (ร้านปิดไฟดับชั่วคราว)']
  }
];

export const PYTHON_CLEANSING_CODE = `# ==============================================================================
# PIPELINE: Fresh Food Data Preparation & Cleaning (CRISP-DM Phase 3)
# Target: Handle Missing Values, Filter Bulk Outliers, Engineer Features, PDPA Hash
# ==============================================================================
import pandas as pd
import numpy as np
import hashlib

def prepare_fresh_food_dataset(raw_df: pd.DataFrame) -> pd.DataFrame:
    df = raw_df.copy()
    print("[1/5] Checking raw data shape and corruptions:", df.shape)
    
    # --------------------------------------------------------------------------
    # 1. Missing Data Handling: Same-day Last Week Imputation
    # เติมค่าว่างยอดขายในช่วงที่ระบบขัดข้อง ด้วยค่าเฉลี่ยย้อนหลังวันเดียวกันของสัปดาห์ก่อน
    # --------------------------------------------------------------------------
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['day_of_week'] = df['timestamp'].dt.day_name()
    
    # คำนวณ Same-day Last Week Mean
    same_day_lookup = df.groupby(['branch', 'sku', 'day_of_week'])['rawSalesQty'].transform('median')
    
    missing_mask = df['rawSalesQty'].isna()
    df.loc[missing_mask, 'sales_qty'] = same_day_lookup[missing_mask]
    print(f" -> Fixed {missing_mask.sum()} missing records via Same-Day Last Week Imputation")
    
    # แก้ไขค่ายอดขายติดลบจากระบบ POS Glitch
    negative_mask = df['rawSalesQty'] < 0
    df.loc[negative_mask, 'sales_qty'] = df.loc[negative_mask, 'rawSalesQty'].abs()
    print(f" -> Converted {negative_mask.sum()} negative sales records to absolute positive values")

    # --------------------------------------------------------------------------
    # 2. Noise Filtering: Isolating Bulk Order Outliers (คำสั่งซื้อเหมาพิเศษ)
    # แยกยอดขายที่โดดผิดปกติจากคำสั่งซื้อเหมาออก เพื่อไม่ให้ค่าพยากรณ์วันปกติเพี้ยน
    # --------------------------------------------------------------------------
    def flag_bulk_orders(group):
        q25 = group['sales_qty'].quantile(0.25)
        q75 = group['sales_qty'].quantile(0.75)
        iqr = q75 - q25
        upper_bound = q75 + (2.5 * iqr)
        return (group['sales_qty'] > upper_bound) | (group['orderType'] == 'Bulk Catering')
    
    df['is_bulk_anomaly'] = df.groupby(['sku'])[['sales_qty', 'orderType']].apply(flag_bulk_orders).reset_index(level=0, drop=True)
    bulk_count = df['is_bulk_anomaly'].sum()
    print(f" -> Isolated {bulk_count} bulk/event orders to dedicated event-buffer model")

    # --------------------------------------------------------------------------
    # 3. Feature Engineering: Seasonality, Payday Effect, Weather Impact
    # --------------------------------------------------------------------------
    day_num = df['timestamp'].dt.day
    # วันเงินเดือนออก (Payday Effect): วันที่ 25-30 และ 1-2
    df['payday_flag'] = day_num.apply(lambda d: 1.35 if (d >= 25 or d <= 2) else 1.0)
    
    # Seasonality Index (เสาร์-อาทิตย์ = 1.45, ศุกร์ = 1.20, จ-พฤ = 0.90)
    weekday_map = {'Monday': 0.88, 'Tuesday': 0.85, 'Wednesday': 0.90, 'Thursday': 0.92, 
                   'Friday': 1.22, 'Saturday': 1.48, 'Sunday': 1.55}
    df['seasonality_index'] = df['day_of_week'].map(weekday_map).fillna(1.0)
    
    # Weather Footfall Factor
    weather_impact = {'Sunny': 1.05, 'Rainy': 0.82, 'Heavy Storm': 0.65}
    df['weather_factor'] = df['weather'].map(weather_impact).fillna(1.0)

    # --------------------------------------------------------------------------
    # 4. Data Anonymization: PDPA Compliance (PDPA ตัดข้อมูลที่ระบุตัวตนออก)
    # --------------------------------------------------------------------------
    salt = "FreshAI_Enterprise_Salt_2026"
    def hash_pii(val):
        if not val or pd.isna(val):
            return "anon_guest"
        return "usr_" + hashlib.sha256(f"{salt}_{val}".encode()).hexdigest()[:12]
    
    df['hashed_customer_id'] = df['customerTel'].apply(hash_pii)
    # ดรอปคอลัมน์ PII ทิ้งโดยเด็ดขาดตามกฎหมาย PDPA
    df = df.drop(columns=['customerTel', 'customerName', 'rawSalesQty'], errors='ignore')
    print(" -> Anonymized all customer PII into SHA-256 tokens. PDPA Compliance: 100%")

    return df
`;

// Pre-cleansed rows sample
export const CLEAN_DATA_SAMPLE: CleanRow[] = [
  {
    id: 1001,
    timestamp: '2026-09-03 08:30:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    category: 'Fresh Food',
    salesQty: 12.5,
    price: 690,
    weather: 'Sunny',
    temperature: 31,
    isHoliday: false,
    hashedCustomerId: 'usr_c8f41e0b82f9',
    isBulkOutlier: false,
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'PDPA Anonymized'
  },
  {
    id: 1002,
    timestamp: '2026-09-03 09:15:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    category: 'Bakery',
    salesQty: 42.0, // Imputed
    price: 65,
    weather: 'Sunny',
    temperature: 31,
    isHoliday: false,
    hashedCustomerId: 'usr_7b9201fec401',
    isBulkOutlier: false,
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'Same-day Last Week Imputation'
  },
  {
    id: 1003,
    timestamp: '2026-09-03 10:20:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'เนื้อวัววากิวสันนอกสไลซ์ (A4)',
    category: 'Fresh Food',
    salesQty: 8.0, // Converted from -8.0
    price: 1650,
    weather: 'Rainy',
    temperature: 28,
    isHoliday: false,
    hashedCustomerId: 'usr_a109ec9881bb',
    isBulkOutlier: false,
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'Negative POS Glitch Inversion'
  },
  {
    id: 1004,
    timestamp: '2026-09-03 11:45:00',
    branch: 'สาขาสยามพารากอน (Flagship)',
    sku: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    category: 'Dessert',
    salesQty: 150.0,
    price: 95,
    weather: 'Sunny',
    temperature: 33,
    isHoliday: false,
    hashedCustomerId: 'usr_883fb10022de',
    isBulkOutlier: true, // Isolated
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'Isolated into Bulk Event Pool'
  },
  {
    id: 1005,
    timestamp: '2026-09-03 12:30:00',
    branch: 'สาขาเซ็นทรัลลาดพร้าว',
    sku: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    category: 'Ready-to-eat',
    salesQty: 18.0,
    price: 159,
    weather: 'Heavy Storm',
    temperature: 26,
    isHoliday: false,
    hashedCustomerId: 'usr_e04419ad2291',
    isBulkOutlier: false,
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'PDPA Anonymized & Storm Factor Added'
  },
  {
    id: 1006,
    timestamp: '2026-09-03 14:10:00',
    branch: 'สาขาเชียงใหม่ นิมมาน',
    sku: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
    category: 'Beverage',
    salesQty: 25.0, // Imputed
    price: 65,
    weather: 'Rainy',
    temperature: 27,
    isHoliday: false,
    hashedCustomerId: 'usr_f5529ab11438',
    isBulkOutlier: false,
    seasonalityIndex: 0.92,
    paydayFactor: 1.0,
    cleansedMethod: 'Same-day Last Week Imputation'
  }
];

export const INITIAL_OPTIMIZATION_ITEMS: InventoryOptimizationItem[] = [
  {
    id: 'OPT-1',
    skuId: 'SKU-001',
    skuName: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    category: 'Fresh Food',
    unit: 'กก.',
    unitCost: 480,
    sellingPrice: 690,
    currentStock: 12,
    aiPredictedDemand: 52,
    underageCost: 210, // 690 - 480
    overageCost: 480, // Full spoilage
    criticalRatio: 0.304, // 210 / (210 + 480)
    optimalOrderQty: 48,
    safetyMinFloor: 25,
    safetyMaxCeiling: 75,
    suggestedPoQty: 36, // 48 - 12
    status: 'Auto-Approved'
  },
  {
    id: 'OPT-2',
    skuId: 'SKU-002',
    skuName: 'เนื้อวัววากิวสันนอกสไลซ์ (A4)',
    category: 'Fresh Food',
    unit: 'กก.',
    unitCost: 1100,
    sellingPrice: 1650,
    currentStock: 6,
    aiPredictedDemand: 26,
    underageCost: 550,
    overageCost: 1100,
    criticalRatio: 0.333,
    optimalOrderQty: 25,
    safetyMinFloor: 12,
    safetyMaxCeiling: 45,
    suggestedPoQty: 19,
    status: 'Auto-Approved'
  },
  {
    id: 'OPT-3',
    skuId: 'SKU-003',
    skuName: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    category: 'Bakery',
    unit: 'ชิ้น',
    unitCost: 28,
    sellingPrice: 65,
    currentStock: 25,
    aiPredictedDemand: 180,
    underageCost: 37,
    overageCost: 28,
    criticalRatio: 0.569,
    optimalOrderQty: 195,
    safetyMinFloor: 80,
    safetyMaxCeiling: 280,
    suggestedPoQty: 170,
    status: 'Auto-Approved'
  },
  {
    id: 'OPT-4',
    skuId: 'SKU-005',
    skuName: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    category: 'Ready-to-eat',
    unit: 'กล่อง',
    unitCost: 85,
    sellingPrice: 159,
    currentStock: 20,
    aiPredictedDemand: 95,
    underageCost: 74,
    overageCost: 85,
    criticalRatio: 0.465,
    optimalOrderQty: 92,
    safetyMinFloor: 35,
    safetyMaxCeiling: 140,
    suggestedPoQty: 72,
    status: 'Auto-Approved'
  },
  {
    id: 'OPT-5',
    skuId: 'SKU-007',
    skuName: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    category: 'Dessert',
    unit: 'กล่อง',
    unitCost: 45,
    sellingPrice: 95,
    currentStock: 15,
    aiPredictedDemand: 80,
    underageCost: 50,
    overageCost: 45,
    criticalRatio: 0.526,
    optimalOrderQty: 82,
    safetyMinFloor: 30,
    safetyMaxCeiling: 120,
    suggestedPoQty: 67,
    status: 'Auto-Approved'
  },
  {
    id: 'OPT-6',
    skuId: 'SKU-009',
    skuName: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
    category: 'Beverage',
    unit: 'ขวด',
    unitCost: 25,
    sellingPrice: 65,
    currentStock: 30,
    aiPredictedDemand: 135,
    underageCost: 40,
    overageCost: 25,
    criticalRatio: 0.615,
    optimalOrderQty: 140,
    safetyMinFloor: 60,
    safetyMaxCeiling: 200,
    suggestedPoQty: 110,
    status: 'Auto-Approved'
  }
];

export const MARKDOWN_ALERTS_INITIAL: MarkdownAlertItem[] = [
  {
    id: 'MD-01',
    skuId: 'SKU-001',
    skuName: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    category: 'Fresh Food',
    unit: 'กก.',
    originalPrice: 690,
    currentStock1700: 16.5,
    safeRemainingThreshold: 7.0,
    projectedEveningSales: 7.5,
    excessRiskUnits: 9.0,
    recommendedDiscountPct: 35,
    discountedPrice: 448.5,
    wasteLossAvoidedTHB: 4320,
    posAlertStatus: 'Active',
    timeTrigger: '17:00 น.'
  },
  {
    id: 'MD-02',
    skuId: 'SKU-003',
    skuName: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    category: 'Bakery',
    unit: 'ชิ้น',
    originalPrice: 65,
    currentStock1700: 55,
    safeRemainingThreshold: 20,
    projectedEveningSales: 22,
    excessRiskUnits: 33,
    recommendedDiscountPct: 40,
    discountedPrice: 39,
    wasteLossAvoidedTHB: 924,
    posAlertStatus: 'Active',
    timeTrigger: '17:00 น.'
  },
  {
    id: 'MD-03',
    skuId: 'SKU-005',
    skuName: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    category: 'Ready-to-eat',
    unit: 'กล่อง',
    originalPrice: 159,
    currentStock1700: 24,
    safeRemainingThreshold: 8,
    projectedEveningSales: 9,
    excessRiskUnits: 15,
    recommendedDiscountPct: 30,
    discountedPrice: 111.3,
    wasteLossAvoidedTHB: 1275,
    posAlertStatus: 'Active',
    timeTrigger: '17:00 น.'
  },
  {
    id: 'MD-04',
    skuId: 'SKU-007',
    skuName: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    category: 'Dessert',
    unit: 'กล่อง',
    originalPrice: 95,
    currentStock1700: 28,
    safeRemainingThreshold: 10,
    projectedEveningSales: 11,
    excessRiskUnits: 17,
    recommendedDiscountPct: 35,
    discountedPrice: 61.75,
    wasteLossAvoidedTHB: 765,
    posAlertStatus: 'Active',
    timeTrigger: '17:00 น.'
  }
];

export const SAMPLE_POS: PurchaseOrder[] = [
  {
    poNumber: 'PO-20260910-0081',
    date: '2026-09-10',
    branch: 'สาขาสยามพารากอน (Flagship)',
    supplier: 'บจก. สยามซีฟู้ด อินเตอร์ฯ',
    category: 'Fresh Food',
    itemsCount: 4,
    totalQty: 85,
    totalAmountTHB: 38500,
    status: 'Generated (17:00)',
    dispatchTime: '17:02 น.'
  },
  {
    poNumber: 'PO-20260910-0082',
    date: '2026-09-10',
    branch: 'สาขาสยามพารากอน (Flagship)',
    supplier: 'ครัวเบเกอรี่กลาง สาขาหลัก',
    category: 'Bakery',
    itemsCount: 6,
    totalQty: 320,
    totalAmountTHB: 18400,
    status: 'Confirmed by Vendor',
    dispatchTime: '17:00 น.'
  },
  {
    poNumber: 'PO-20260910-0083',
    date: '2026-09-10',
    branch: 'สาขาสยามพารากอน (Flagship)',
    supplier: 'เซ็นทรัล คิตเช่น เดลี่',
    category: 'Ready-to-eat',
    itemsCount: 3,
    totalQty: 95,
    totalAmountTHB: 14200,
    status: 'Dispatched via EDI',
    dispatchTime: '17:05 น.'
  },
  {
    poNumber: 'PO-20260910-0084',
    date: '2026-09-10',
    branch: 'สาขาสยามพารากอน (Flagship)',
    supplier: 'คาเฟ่ บาริสต้า ฮับ',
    category: 'Beverage',
    itemsCount: 2,
    totalQty: 180,
    totalAmountTHB: 9500,
    status: 'Confirmed by Vendor',
    dispatchTime: '17:08 น.'
  }
];

export function getPerishabilityInfo(shelfLifeDays: number): PerishabilityInfo {
  if (shelfLifeDays <= 2) {
    return {
      tier: 'Ultra-Fresh (1-2 วัน)',
      riskLevel: 'วิกฤตสูงสุด (Critical)',
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      recommendedAction: 'ตรวจสต็อกทุก 2 ชม. + เตรียมเคาะป้ายเหลือง 17:00 น.'
    };
  } else if (shelfLifeDays <= 5) {
    return {
      tier: 'Short Shelf-Life (3-5 วัน)',
      riskLevel: 'เฝ้าระวังสูง (High)',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      recommendedAction: 'หมุนเวียนสินค้า FIFO เคร่งครัด + เผื่อ Safety Stock ปานกลาง'
    };
  }
  return {
    tier: 'Medium (7+ วัน)',
    riskLevel: 'ปานกลาง (Medium)',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    recommendedAction: 'สั่งซื้อรอบปกติ 2-3 วัน/ครั้ง + จัดแคมเปญกระตุ้นยอด'
  };
}

export const PARETO_WASTE_DATA: ParetoWasteItem[] = [
  {
    skuName: 'ปลาแซลมอนนอร์เวย์สด (Fillet)',
    category: 'Fresh Food',
    shelfLifeDays: 2,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 148800,
    percentageOfTotal: 30.8,
    cumulativePercentage: 30.8,
    unitsDiscarded: 310,
    potentialAiSavingTHB: 111600
  },
  {
    skuName: 'หมูสามชั้นสไลซ์ชาบู สด',
    category: 'Fresh Food',
    shelfLifeDays: 2,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 122400,
    percentageOfTotal: 25.4,
    cumulativePercentage: 56.2,
    unitsDiscarded: 790,
    potentialAiSavingTHB: 91800
  },
  {
    skuName: 'ข้าวกล่องแซลมอนย่างซีอิ๊ว (Ready-to-eat)',
    category: 'Ready-to-eat',
    shelfLifeDays: 1,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 107100,
    percentageOfTotal: 22.2,
    cumulativePercentage: 78.4,
    unitsDiscarded: 1260,
    potentialAiSavingTHB: 80325
  },
  {
    skuName: 'ครัวซองต์เนยสดฝรั่งเศส (อบสดเช้า)',
    category: 'Bakery',
    shelfLifeDays: 1,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 42000,
    percentageOfTotal: 8.7,
    cumulativePercentage: 87.1,
    unitsDiscarded: 1500,
    potentialAiSavingTHB: 31500
  },
  {
    skuName: 'ข้าวเหนียวมะม่วงน้ำดอกไม้สด',
    category: 'Dessert',
    shelfLifeDays: 1,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 28600,
    percentageOfTotal: 5.9,
    cumulativePercentage: 93.0,
    unitsDiscarded: 380,
    potentialAiSavingTHB: 21450
  },
  {
    skuName: 'ชาไทยเย็นสกัดเย็น โคลด์บรูว์ (Cold Brew)',
    category: 'Beverage',
    shelfLifeDays: 3,
    perishabilityTier: 'Short Shelf-Life (3-5 วัน)',
    monthlyWasteCostTHB: 17000,
    percentageOfTotal: 3.5,
    cumulativePercentage: 96.5,
    unitsDiscarded: 250,
    potentialAiSavingTHB: 12750
  },
  {
    skuName: 'ชิฟฟ่อนเค้กมะพร้าวอ่อนสด',
    category: 'Dessert',
    shelfLifeDays: 2,
    perishabilityTier: 'Ultra-Fresh (1-2 วัน)',
    monthlyWasteCostTHB: 16900,
    percentageOfTotal: 3.5,
    cumulativePercentage: 100.0,
    unitsDiscarded: 310,
    potentialAiSavingTHB: 12675
  }
];

export const DATA_ANOMALIES_DATA: DataAnomalyItem[] = [
  {
    id: 'ANOMALY-001',
    type: 'zero_sales_streak',
    title: 'พบช่วงยอดขายเป็น 0 ติดต่อกัน 4 ชม. ในช่วงไพรม์ไทม์ (Zero Sales Streak)',
    description: 'ตรวจพบหมวดเบเกอรี่และของสดช่วง 17:00-21:00 น. ไม่มียอดบันทึกใน POS (สาเหตุ: ระบบไฟตู้แช่ขัดข้องชั่วคราว หรือสต็อกขาดรุนแรง)',
    severity: 'critical',
    affectedCount: 14,
    affectedSample: 'SKU-008 ข้าวกล่องแซลมอน (17:00-20:00 น.)',
    remedyApplied: 'โมเดลแทนที่ด้วย Imputation (K-NN Mean) เพื่อไม่ให้สับสนว่าเป็นดีมานด์แท้จริง'
  },
  {
    id: 'ANOMALY-002',
    type: 'margin_inversion',
    title: 'การตรวจสอบราคาขายและต้นทุน (Unit Cost vs Selling Price)',
    description: 'ตรวจสอบความสัมพันธ์ของราคาขายและต้นทุน ไม่พบรายการติดลบ และ Margin อยู่ในเกณฑ์บวกปกติ (25% - 57%)',
    severity: 'info',
    affectedCount: 0,
    affectedSample: 'ตรวจสอบ 8/8 SKUs สมบูรณ์ 100%',
    remedyApplied: 'Verified ผ่านเกณฑ์การคำนวณ Newsvendor Critical Ratio'
  },
  {
    id: 'ANOMALY-003',
    type: 'outlier_spike',
    title: 'ยอดซื้อเหมาจัดเลี้ยงกระทันหัน (Bulk Catering Outlier Spike)',
    description: 'ตรวจพบบิลซื้อครัวซองต์ 120 ชิ้นในครั้งเดียว (มากกว่าค่าเฉลี่ยปกติ 8.5 เท่า) ซึ่งเป็นดีมานด์พิเศษที่ไม่เกิดขึ้นประจำ',
    severity: 'warning',
    affectedCount: 3,
    affectedSample: 'บิล TX-20260904-412: ครัวซองต์ 120 ชิ้น',
    remedyApplied: 'ทำ Winsorization ปรับ Cap สูงสุดที่ Percentile 99 เพื่อป้องกันโมเดลสั่งของล้นในวันถัดไป'
  },
  {
    id: 'ANOMALY-004',
    type: 'pdpa_pii_flag',
    title: 'การตรวจจับข้อมูลส่วนบุคคลลูกค้าในทรานแซกชัน (PDPA & PII Compliance)',
    description: 'ตรวจพบเบอร์โทรศัพท์และชื่อลูกค้าในฟิลด์สมาชิกเดิม ถูกเข้าสู่ Pipeline เข้ารหัสด้วย SHA-256 และ Salt Token อัตโนมัติ',
    severity: 'critical',
    affectedCount: 1842,
    affectedSample: 'แปลง 081-992-XXXX เป็น Token SHA-256 e3b0c442...',
    remedyApplied: 'ผ่านการเข้ารหัส 100% ตามมาตรฐาน PDPA เรียบร้อยก่อนเข้าสู่ Feature Store'
  }
];

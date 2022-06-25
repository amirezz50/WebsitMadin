
export interface PatientParms {

  patCode?: number;
  cCCallBeneficiaryCode?: number;
  patCustomCode?: string;
  patOldCode?: string;
  birthDate?: Date;
  patFullnameAr?: string;
  patFullnameEn?: string;
  patGender?: number;
  //Visit
  visitSerial?: number;
  visitsList?: string;
  visitNo?: number;
  claimId?: number;
  //Global params
  fastSearchData?: string;
  offset?: number;
  pageSize?: number;
  age?: number;
  visitType?: number;
  visitDate?: Date;
  ngbVisitDate?: any;
  contractId?: number;
  newContractId?: number;
  dataStatus?: number;
  active?: number;
  companyCode?: number;
  companyType?: number;
  branchCompanyCode?: number;
  statusCode?: number;
  specialityId?: number;
  visitFilter?: number;
  phoneNumber?: number;
  docCode?: number;
  patCaseType?: number;
  serviceType?: number;
  regPatServiceSerial?: number;
  dateFrom?:any;
  dateTo?:any;



  // mortaliyFlag?:number;
}
export interface NursingParms {
  patCustomCode?: string;
  billNo?: number
  serviceCustomCode?: string;
  patCode?: number;
  visitSerial?: number;
  serviceType?: number;
  serviceId?: number
  regPatMedicalStepsSerial?: number;
  regPatServiceSerial?: number;
  visitNo?: number;
  doneOrNotFlag: number;
}

export interface EmployeeParms {
  code?: number;
  customCode?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  gender?: number;
  offset?: number;
  pageSize?: number;
  fastSearchData?: string;
  jopId?: number;
  identityValue?: string;
  nationalityId?: number


}


export interface SecurityParms extends EmployeeParms {
  empCode?: number;
  groupId?: number;
  JopId?: number;
  EmpID?: number;
  modulID?: number;
  tableName?: string;
  serial: number;
}

export interface DBRParms {
  docCategory?: number;
  billItemCode?: number;
  supplierCode?: number;
  visitType?: number;
  patState?: number;
  DBRDevRParmsCode?: number;
}




export interface CashierParms extends PatientParms, GeneralSearchParms {
  receiptSerial?: number;
  cancelDownPayment?: number;
  chequeValue?: number;
  couponValue?: number;
  chequeType?: number;
  stockTransType?: number
  patientCode?: number;
  fullNameAr: string;
  fullNameEr: string;
  deposited?: number;
  visaValue?: number;
  visaType?: number;
  chequeNo?: number;
  chequeState?: number;
  checked?: number;
  cash_obtDate?: Date;
  cancelOffer: number;
  cashierCode?: number;
  cashierType?: number;
  bankCode?: number;
  currencyCode?: number;
  currencyFactor?: number;
  cashierTransType?: number;
  cashierUserId?: number;
  dairyDate?: Date;
  claimType?: number;
  claimState?: number;
  benfType?: number;
  supplierCode?: number;
  clientCode?: number;
  docCode?: number;
  nurseCode?: number;
  receiptStatus?: number;
  contractUpdated?: number;
  obBankType?: number;
  empCode?: number;
  payRollMonth?: number;
  transSerial?: number;
  docFeesClaimSerial?: number;
  modifyHandModified?: number;
  permission?: number;
  permissionType?: number;
  paid?: number;
  serial: number;
  startDate: Date;
  endDate: Date;
  startDatestring: string;
  endDatestring: string;
  startMonth: number;
  year: number;
  moduleCode: number;
  priMedicalLetterSerial?: number;
  transType?: number;
  type?: number;
  patCaseType?: number;
  updateServiceFlag?: number,
  updateSurgFlag?: number,
  updateItemFlag?: number,
  updateResedinceFlag?: number
  updateDealsFlag?: number,
  openingBalanceFlag?: number,
  orderMasterSerial?: number,
  billItemCode?: number,
  excutedOrTurnedServices?: number;
  documentLookupCode?: number;
  glJournalCode?: number;
  inputMode?: number;
  operationPlace?: number;
  operationPlace_Ar?: string;
  operationPlace_En?: string;
  claimCode?: number;
  approvedForCancelFlag?: number;
  value?: number;
  branchesParmArr?: string;
  notes?: string;
  cashierUserIdArr?: string;
  cshCashierTransSerial?: number;
  storeCode?: number;
  discountFromBillItem?: number;
  status?: number;
  serialsString?: string;
  sumPatPrice?: number;
  sumSharedPrice?: number;
  sumItemsDetails?: number;
  itemPercent?: number;
  slsClientCode?: number;
  calcWayFlag?: number;
}

export interface SimpleStockParms {
  itemCode?: number;
  unitCode?: number;
  factor?: number;
  storeCode?: any;
  qty?: number;
  operationId?: string;
  barcode?: number;
  store?: number;
  ngbFromDateStr?: Date,
  ngbToDate?: Date,
  itemType?: number;
  tranSerial?: number;
  billNo?: number;
  transType?: number;
  patchCodes?: string;
  barcodeType?: number;
  barcodeLanguage?: number;
  barcodeData?: number;
  nameAr?: string;
  nameEn?: string;
  rePrintBarcodeFrom?: number;
  rePrintBarcodeTo?: number;
  queryCode?: number;
}

export interface StockModuleSettingsParms {
  moduleId?: number;
  transType?: number;
  fieldName?: string;
}
export interface StockParmsSpesial extends PatientParms {
  itemType?: number;
  store?: number;
  fastSearchData?: any;
  ngbToDate?: Date;
  ngbFromDateStr?: Date,
  status?: number,
  supplierCode?: number;
  clientCode?: number;
  fromDate?: Date,
  toDate?: Date;
  serial?: number;


}
export interface StockParms extends PatientParms {
  itemCode?: number;
  unitCode?: number;
  storeCode?: any;
  unitCost?: any;
  store?: number;
  giftFlag?: number;
  docCode?: number;
  ellyNumber?: string
  qRCode?: string
  rxMasterSerial?: number;
  serial?: number;
  supplierCode?: number;
  supplierNameAr?: string;
  supplierNameEn?: string;
  clientCode?: number;
  clientNameAr?: string;
  clientNameEn?: string;

  transCode?: number;
  branchId?: number
  id?: number,
  customID?: number,
  nameAr?: string,
  nameEn?: string,
  descriptionAr?: string,
  notes?: string,
  status?: boolean,
  redendancyId?: number,
  groupId?: number,
  manufacate?: number,
  dosageForm?: number,
  genericName?: string,
  dose?: number,
  frequency?: number,
  period?: number,
  barcode?: number,
  registrationNo?: string,
  specialCode?: number,
  expiryWhenOpen?: true,
  itemType?: number,
  routeId?: number,
  descriptionEn?: string,
  oldID?: number,
  expiry?: number,
  expirationDate?: Date,
  ivFlage?: number,
  isIv?: true,
  billItemCode?: number,
  taxPercent?: number,
  compositItem?: true,
  securityLev?: number,
  specialPriceUnit?: true,
  rowsCount?: number,
  offset?: number,
  pageSize?: number,
  patchSerial?: number,
  patchSmallUnitCost?: any,
  patchSmallUnitSale?: any,
  queryCode?: number;
  ngbFromDateStr?: Date,
  ngbToDate?: Date,
  serviceCode?: number,
  visitSerial?: number,
  patCode?: number,
  fromDate?: Date,
  toDate?: Date;
  supplyStatus?: number;
  mangCode?: number;
  permission?: number;
  transType?: number;
  transferQuan?: number;
  cf_ContractsCode?: number;
  itemNameStartWith?: string;
  barcodeOrCustomCode?: string;
  itemCodesArr?: string;
  isActiveMaterial?: number;
  supplierGroup?: number;
  supplierType?: number;
  clientGroup?: number;
  clientType?: number;
  billNo?: number;
  serviceStatus?: number;
  statusSupplier?: number;
  statusType?: number;
  inventoryByPatch?: number;
  Flag?: number;
}

export interface NursingParms {
  patCustomCode?: string;
  billNo?: number
  serviceCustomCode?: string;
  patCode?: number;
  visitSerial?: number;
  serviceType?: number;
  serviceId?: number
  regPatMedicalStepsSerial?: number;
  regPatServiceSerial?: number;
  visitNo?: number;
}


export interface PricingParms extends PatientParms {
  exceptionType?: number;
  approvalOrNeeded?: number;
  companyTypeCode?: number;
  limitType?: number;
  kind?: number;
  levelNo?: number;
  companyCodeLev2?: number;
  companyCodeLev3?: number;
  priceListCode?: number;
  resDegree?: number;
  type?: number;
  operSkill?: number;
  companyNameAr?: string;
  companyNameEn?: string;
  dealCode?: number;
  dealName?: string;
  serviceId?: number;
  priDealIdentifierSerial?: number;
  hasVadFlag?: number;
  vadType?: number;
  vadValue?: number;
  /*hghghghghghgh sayed*/
  inpatHasDiscount?: number;
  inpatHasSharingPercentage?: number;
  outpatHasDiscount?: number;
  outpatHasSharingPercentage?: number;
  eRHasDiscount?: number;
  eRHasSharingPercentage?: number;

}
export interface CompanySetting {
  inpatHasDiscount?: number;
  inpatHasSharingPercentage?: number;
  outpatHasDiscount?: number;
  outpatHasSharingPercentage?: number;
  erHasDiscount?: number;
  erHasSharingPercentage?: number;


}

export interface ClaimsParms extends PatientParms, GeneralSearchParms {
  startDate?: Date;
  endDate?: Date;
  claimFlag?: number;
  receiptSerial?: number;
  levelNo?: number;
  deleteReason?: any;
  templateSerial?: number;
  templateSerial_En?: string;
  branches?: string;
  billItemCodeArr?: string;
  claimId?: number;
}

export interface InPatientParms extends PatientParms, GeneralSearchParms {
  ReservationDate?: any;
  SpecialityId?: number;
  ResourceType?: number;
  age?: number;
  DocCode?: number;
  resservationRequestStatus?: number;
  ResDegSerial?: number;
  FloorCode?: number;
  RoomCode?: number;
  BedCode?: number;
  claimId?: number;
  alertDepartId?: number;
  companionCode?: number;
  serviceCode?: number;
  orderMasterSerials?: string;
  dischargeAlertCode?: number;
  [propName: string]: any;
  rxFlage: number;
  rxMasterSerial: number;
  filterBranchesArr?: string;
  docNurseMode?: number;
  mortaliyFlag?: number;
  exitTemporaryFlag?: number;
  visitHistoryFlag?: number;
  ContractsAr?: string;
  ContractsEn?: string;
  roomNameAr?: string;
  roomNameEn?: string;
  startDate?: Date;
  regDate?: Date,
  gender?: any,
  docNameAr?: string,
  docNameEn?: string,
}


export interface HrParms extends PatientParms, GeneralSearchParms {
  fromEmpCode: number;
  empCode: number;
  depCode: number;
  empCustomCode: number;
  empOldCode: number;
  storeCode: number;
  itemCode: number;
  empFullnameAr: string;
  empFullnameEn: string;
  //sayed
  RevisedForPenality: number;
  empGender: number;
  jobType: number;
  JobId: number;
  workStatus: number;
  section: number;
  vacationCode: number;
  qualificationCode: number;
  jobDegreeCode: number;
  attendMethod: number;
  payRollMonth: number;
  payRollYear: number;
  payrollType: number;
  mainItem: number;
  groupByType: number;
  payRollMonthStart: number;
  payRollMonthEnd: number;
  monthCode: number;
  yearCode: number;
  empStatus: number;
  contractType: number;
  compsPercent: number;
  reqDate: Date;
  mode: number;
  adminMode: number;
  department: number;
  searchType: number
  manageCode: number;
  //hr vacation names search parms --asma--
  serial: number;
  nameAr: string;
  nameEn: string;
  vacStaticType: number;
  discountWeekOfficialVac: number;
  shiftedBalane: number;
  maxShiftBalance: number;
  requestBeforeDays: number;
  maxOrderDays: number;
  requestForAll: number;
  discountPercent: number;
  salItemId: string;
  salItemNameAr: string;
  compValue: number;
  arrStr: string;
  violation: number;
  //--end --

  reqType: number;
  reject: any;
  accept: any;
  reqSerial: any;

  //--General_Properties
  value: number;
  valueType?: number;
  min: number;
  max: number;
  transDate: Date;
  code: number;
  decesionNum: number;
  newType: number;
  revised: number;
  year: number;
  month: number;
  procName: string;
  overTimeType: number;
  confirmedFingerPrint: number;
  inCompleteFingerPrint: number;
  expenceWay?: number;
  bankCode?: number;
  branchesParmArr?: string;
  hrServiceAwardReasons?: number;
  hrEmpServingBranch?: number;
  genDefaultAlertCode?: number;
  empSalIncrease: number
}
export interface UpdateHrEmpCalcSalary extends PatientParms, GeneralSearchParms {

  empCode: number;
  sectionId: number;
  payRollMonth: number;
  payRollYear: number;
  payrollType: number;
  mainItem: number;
  groupByType: number;
  departmentId: number;
  costCenterCode: number;
}

export interface HrEmpAttendCalc {
  serial: number;
  empId: number;
  attendDay: Date
  attendType: number;
  att: Date;
  leave: Date;
  attendSysSerial: number;
  shiftId: number;
  attStp: Date;
  leaveStp: Date;
  freeAttend: number;
  freeLeave: number;
  dayFree: number;
  earlyAttend: number;
  late: number;
  earlyLeave: number;
  overTime: number;
  dateFrom: Date
  dateTo: Date;
  hourVal: number;
  hourValRound: number

}

export interface HrempcalSal {
  hrParms: HrParms;
  hrempParms: UpdateHrEmpCalcSalary[];
}

export interface MaintainenceParms extends PatientParms, GeneralSearchParms {
  mntStatus?: number;
  deviceCode?: number;
}

export interface EmergencyParms extends PatientParms, GeneralSearchParms, InPatientParms {
  visitType: number;
  cCCallBeneficiarySerial: number
  callTypeFlag: number;
  expectedServicePatient: number;
  tableName: string
  callReason: number
  callResult: number
  deviceCode?: number
  remainingMsgFlag: number
}

export interface CallCenterParms extends PatientParms, GeneralSearchParms, InPatientParms {

}
export interface OutpatientParms extends PatientParms {
  SpecialityId?: number;
  ReservationDate?: Date;
  reservFlag?: number
  Notes?: string;
  DocCode?: number;
  ResourceType?: number;
  Slot?: any;
  CheckFutureDate?: number;
  ShiftId?: number;
  steps?: string;
  ngbFromDateStr?: string;
  ngbToDateStr?: string;
  vPlace?: number;
  reportType?: any;
  groupBy?: number;
  examinationState?: number;
  docAppologize?: number;
  portalState?: number;
  serviceCode?: number;
  tServiceId?: number;
  serviceStatus?: number;
  entityType?: number;
  resources?: string;
  ccCallSerial?: number,
  resourceId?: number,
  scheduleType?: number;
  scheduleDocID?: number;
  scheduleDeviceID?: number;
  scheduleVplaceID?: number;
  patCode?: number;
  visitSerial?: number;
  mode?: number;
  monthNo?: number;
  year?: number;
  day?: number;
}

export interface GlParms extends PatientParms {
  serial?: number;
  glValue?: number;
  serialPerBranch?: number;
  glValueFrom?: number;
  glValueTo?: number;
  glAccountNumber?: number;
  glDaily?: Date;
  glDailySerial?: number;
  dayFrom?: Date;
  dayTo?: Date;
  glJouTypeCode: number;
  regDate?: number;
  description?: string;
  year?: number;
  day?: number;
  month?: number;
  dailyTypeConstrain?: number,
  payrollType?: number;
  monthNo?: number;
  mode?: number;
  branchID?: number;
  dataStatus?: number;
  stockNature?: number;
  serials?: string;
  chequeSerials?: string;
  transferSerials?: string;
  expensseSerials?: string;
}
export interface ApprovalParms extends PatientParms, GeneralSearchParms {

  reqDate?: Date;
  approvalDate?: Date;
  serviceCode?: number;
  docCode?: number;
  approvalNumber?: number;
  approvalSerial?: number;
  policyNumber?: number;
  serial?: number;
  approvalCategory?: number;

}
export interface SheetParms extends PatientParms, GeneralSearchParms {
  serial?: number;
  sheetSerial?: number;
  sheetsSerials?: string;
  identifier?: number;
  identifierType?: number;
  sheetsEntrySerial?: number;
  reportType?: number;
  emrHtmlTemplatesSerial?: number;
  htmlContent?: string;
  editMode?: boolean;
}
export interface EmrParms extends SheetParms {
  patientCode?: number;
  headerBodyFlag?: number;
  servicetype?: number;
  patListLookupCode: number;
  formKey: number;
  getDocFavoriteList?: number;
}

export interface OrderParms {
  serial?: number;
  reqDate?: Date;
  docId?: string;
  visitSerial?: number;
  visitNo?: number;
  status?: number;
  offset?: number;
  pageSize?: number;
  serviceType?: number;
  fromDate?: Date;
  toDate?: Date;
  serviceCode?: number;
  patCode?: string;
  specialityId?: number;
  fastSearchData?: any;
  orderDetailSerial?: number;
  scheduledResourceCode?: number;
  scheduledResourceType?: number;
  scheduledResourceArr?: string;
  freeDatesNo?: number;
  patientAge?: number;
  payed?: number;
  resourceType?: number;
  resourceId?: number;
  entityType?: number;
  steps?: any;
  forDocPatList?: number;
  executingBranchId?: number;
  receiptNumber?: number;
  cancelReason?: number;
  cancelNotes?: string,
  serviceCategory?: number;
  sceduleEmpId?: number;
  sceduleDeviceId?: number;
  vPlaceId?: number
}

export interface BillParms extends CashierParms {
  billSerial?: number;
  payed?: number;
  cancelBill?: number;
  type?: number;
  chargeSerial?: number;
  docCategory?: number;
  //billItemCode?: number;
  serviceId?: number;
  dealCode?: number;
  companyType?: number;
  serviceCategory?: number;
  turnedSide?: number;
  masterRuleSerial?: number;
  afterBeforDeals?: number;
  floorCode?: number;
}

export interface GeneralSearchParms {
  fromDate?: Date;
  toDate?: Date;
  ngbFromDate?: Date;
  ngbToDate?: Date;
  offset?: number;
  pageSize?: number;
  mode?: number;

}
export interface GeneralSearchSpecialParms {
  fromDate?: Date;
  patCode?: number;
  serviceCode?: number,

  toDate?: Date;
  ngbFromDate?: Date;
  ngbToDate?: Date;
  offset?: number;
  pageSize?: number;
  mode?: number;

}
export interface AuditParms extends GeneralSearchParms {
  patCode?: number;
  tableName: string;
  schemaTablesSerial?: number;
  colName: string;
  keyColumnSerial?: number;
}


export interface AssetsParms extends StockParms {

  AssetsTypeSerial?: number;
  BookValue?: number;
  SupSupplierCode?: number;
  SlsClientCode?: number;
  ReceivedDate: Date;
  HrDepCode?: number;
  DepreciationRate?: number;
  DepreciationType?: number;
  Color: string;
  Brand: string;
  AssetsBarcode?: number;
  AssetsAccoutNo?: number;
  DepreciationAccountNo?: number;
  DepreciationGroupDepreciation?: number;
  EmpCode?: number;
  DirectAddSerial?: number;
  Branch?: number;
  CurrentValue?: number;
  DateOfOperation: Date;
  SumOfDepreciation?: number;
  TransDate: Date;
  TransType?: number;
  TotalCost?: number;
  BillNo?: number;
  TransStatus?: number;
  AssetsTransMasterSerial?: number;
  AssetsGroup?: number;
  Count?: number;
  BarCode?: number;
  Code?: number;
  Type?: number;
  ServiceType?: number;
  AssetId?: number;
  AssetsDeviceCode?: number;
  PriServiceCode?: number;
  rowsCount?: number;
  dateOfOperation?: Date,
  hrDepCode?: number,
  empCode?: number,
  placeCode?: number,
  payed?: number,

  ///assets-Depreciation
  currentValue?: number,
  sumOfDepreciation?: number,
  assetsMainDataSerial?: number,
  year: string,
  month?: number
}

export interface RxParms extends PatientParms {
  rxDetailsSerial?: number,
  rxMasterSerial?: number,
  dateFrom?: Date,
  dateTo?: Date,
  schedStatus?: number,
  visitSerial: number,
  doseDateTime: Date;
  time?: number,
  date?: Date,
  dataStatus?: number,
  itemCode?: number,
  notes?: string,
  doseState?: number,
  notTakenDoseReasonId?: string,
  tookDateTime?: Date,
  serial?: number,
  doseQty?: any,
  doseType?: any;
}


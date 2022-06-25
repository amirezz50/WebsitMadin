import { DocManagementTrans } from "../../docu-manage-new/image-upload-new";
import { TherapeuticCards } from "../portal-contracts";

export interface PatientReservation {
    therapeuticCards: TherapeuticCards;
    regPatVisit: RegPatVisit;
    regPatEpisode: RegPatEpisode;
    regPatServices: RegPatService[];
    visitDocuments: DocManagementTrans[];
    callData?: CallData;
    comprehensiveRequestMaster?: ComprehensiveRequestMaster,
    comprehensiveRequestDetail?: RegPatService[],
    orderMaster?: OrderMaster,
    OrderDetails?: OrderDetails[],
    RegPatServicesOrderDetail? : RegPatService[];

   
}


export interface RegPatVisit {
    serial?: number;
    patCode?: number;
    visitNo?: number;
    episodeCode?: number;
    lastResidenceDate?: Date;
    docId?: number;
    allRoom?: boolean;
    placeCode?: number;
    type?: number;
    // mobile:string;
    dischargeStatus?: number;
    cancelReason?: number;

    startDate?: Date;
    endDate?: Date;

    contractId?: number;
    cardSerial?: number;
    inTransferBodiesSerial?: number;

    dischargeRemarks?: string;
    addmissionRemarks?: string;

    visitReason?: number;
    visitStatus?: number;
    bedInfo?: string;
    paymentOn?: number
    priResidenceDegreeSerial?: number;
    patCaseType?: number;
    medicalCaseType?: number;
    expectedLOS?: number;
    turnedDdoc?: number;

    patFromOrder?: number;
    oldVisitSerial?: number;
    calledDocFlag?: number;
    visitDocuments?: { documentLookupCode: number; base64: string }[];
    ///////////////////////////////
    exitType?: number;
    diagnosiesAsText?: string;
    speciality?: number;
    eligibilityNo?: number;
    specialityId?: number;
    medicalProgramFlag?: number;
    regPatRequestsSerial?:number ; 
    requestType?:number ; 
}

export interface RegPatEpisode {

    PatCode?: number;
    Serial?: number;
    serial?: number;
    StartDate: Date;
    EndDate?: Date;
    Remarks?: string;
    Descreptions?: string;
    DiagnosiesCode?: number;
    DiagText?: string;
}

export interface RegPatService {
    serial?: number;
    serviceId?: number;
    visitSerial?: number;
    orderDetailSerial?: number;
    examService?: boolean;
    startDate?: Date;
    endDate?: Date;
    expectedStartTime?: Date;
    expectedEndTime?: Date;
    resourceId?: number;
    resourceScheduleId?: number;
    servStatus?: number;
    vPlaceId?: number;
    contractId?: number;
    itemCode?: number;
    specialityId?: number;
    serviceCost?: number;
    scheduledResourceCode?: number;
    scheduledResourceType?: number;
    regPatRequestsSerial?: number;
    code?: number;
    comprehensiveService?: number;
    nameAr?: String;
    nameEn?: string;
    toothNo?: string;
    serviceType?: number;
    operNameAr?: string;
    operNameEn?: string;
    dealFlag?: number;
    canBeDeal?: boolean;
    cashCharge?: number;
    patSharingPercentFromCard?: number;
    patSharingPercentFromCardFlag?: number;
    sharedOperFlag?: number;
    count?: number;
    notes?: string
    callSerial?: number
    // for ui
    slot?: number;
    customServiceCode?: number;
    serviceNameAr?: string;
    serviceNameEn?: string;
    price?: number;
    Anesthesiologist?: number;
  
    // for workflow
    deviceId?: number;
    serviceIdArr?: string;
    itemCodeArr?: string;
    totalOrderSharedPrice?: number;
    totalOrderPatPrice?: number;
    dealSerial?: number;
    dealStartDate?: Date;
    dealEndDate?: Date;
    quantity?: number;
    printedCount?: number;
    docCode?: number;
    empId?: number
    labSampleTypeCode?: number;
    time?: Date;
    // sampleId?:number
    TakenDate?: Date
    sampleStatus?: number
    statusReason?: number;
    regPatServiceSerial?: number;
    sampleId?: number;
    deleveryType?: number;
    scheduleTimeSerial?: number;
    bodyPart?: number;
    priComprehensiveCode?: number;
    followUpFlag?: number;
    priceListStpCode?: number;
    doneExternalFlag?: number;
    /////////////
    entityType?: number;
    secondEntityType?: number;
    secondResourceId?: number;
    delayOrFollowUp?: number;
    portalState?: number;
    sameDateSelected?: number;
    //////////////
    executedByDocId?: number;
    supplierCode?: number;
    priDealsMainDataCode?: number;
    execuetedOutSideHosp?: number;
    matrixSchedule?: number;
    editDoctorsData?: number,
    discountValue?: number,
    percentOrValue?: number,
    cshDiscountsCode?: number,
    patPrice?: number,
    serviceCode?: number,
    ///  
    visitDocCode?: number,
    cshcashierDoc?: number,
    docFeesDetailSerial?: number,
    revisionType?: number,
    itemPackageSelected?: number;
    priComprehensiveServiceSerial?: number;
    cshCashierTransDetailSerial?: number;
    comprehensiveRequestDetailUpdateFlag?: number;
    compReqMasterSerial?: number ; 
    requestType?: number ; 
  }
  
export interface CallData {
    serial: number;
    phoneNumber: string;
    address: string;
    callResult: string;
    notes: number;
    callerName: string;
    nationalityId: string;
    callReason: number;
    specialization: number;
    branchAddress: number;
    callStart: Date;
    callEnd: Date;
    expectedStartTime?: Date,
    expectedEndTime?: Date,
    dateOnly?: string,
    genDaysNameAr?: string,
    genDaysNameEn?: string,
    startTimeOnly?: string,
    endTimeOnly?: string,
    
    minutesPerSlot?: number
    reservationDate?: Date;
    arrivalResult: number;
    serviceCode: string;
    visitSerial: number;
    patCode: number;
    cCCallBeneficiarySerial: number
    dataStatus: number;
    docNotesOnCall: string;
    docId: number;
    anesthesiologist: number;
  
    callTypeFalg: number;
    secoundMobile: string;
    cancelReason?: number;
    cancelNotes: string;
    reservationType: number;
    callSort: number;
  }
  export interface ComprehensiveRequestMaster {
    serial?: number
    visitSerial?: number
    comprehensiveExaminCode?: number
    priceListCode?: number
    serviceId?: number
    price?: number
    patCode ?: number ; 
}
export interface OrderMaster {
    serial: number;
    reqDate?: Date;
    docId?: number;
    visitSerial?: number;
    status?: number;
    cancelReason?: number;
    cancelNotes: string;
    // external properties
    allowAddServToClosedVisit?: number;
    forDocPatList?: number;
    executingBranchId?: number;
    requestType?: number;
}


export interface OrderDetails {
    serial: number;
    orderMasterSerial: number;
    serviceCode: number;
    freqFlag?: number;
    freqType?: number;
    freqQty?: number;
    quantity?: number;
    periodType?: number;
    periodQty?: number;
    startDate?: Date;
    endDate?: Date;
    days?: string;
    status?: number;
    schedStatus?: number;
    flags?: number;
    periorty?: number;
    reason?: number;
    reasonId?: number;
    notes?: string;
    count?: number;
    approvalStatus?:number ;
    sessionSort?:number;
    // not mapped
    patSharingPercentFromCard?:number;
    patSharingPercentFromCardFlag?:number;
    priDealsMainDataCode?:number;
    dealStartDate?: Date;
    dealEndDate?: Date;
    // prop for ui only
    periodDecAr?: string;
    periodDecEn?: string;
    serviceNameAr?: string;
    serviceNameEn?: string;
    updatestatus?:number;
    needApproval?: number;
    patPrice?: number;
    netPrice?: number;
    sharedPrice?: number;
    notCoverd?: number;
    orderType?: number;
    orderName?: string;
    operNameAr?: string;
    operNameEn?: string;
    labSampleTypeCode?: number;
    canBeDeal?: any;
    cashCharge?: boolean;
    limitExceeded?:number ;
    serviceRuleNameAr:String;
    serviceRuleNameEn:String;
    showRule?:boolean;
    payed?: number;
    existsBefore?: number;
    servicePrice? :number;
    rechargeServiceWithDeal?:number;
    customServiceCode : number;
    bodyPart: number;
    maxServiceCount?: number;
    doneExternalFlag?: number;
    execuetedOutSideHosp?: number;
    supplierCode?: number;
    schedulingDescAr?: string;
    afterDiscount?: number;
    schedulingDescEn?: string;
    cshDiscountsCode?:number
    discountValue?:number
    percentOrValue?:number
    dataStatus?:  number;
    executedByDocId?: number
    scheduledResourceCode?: number,
    scheduledResourceType: number

} 


export interface IResetPasswordObj {
    code?: number;
    userName?: string;
    password?: string;
    mobile: string;
    activationCode?: string;
    registerStep?: number;
  }
  
  
  
  export interface Patient {
    code: number;
    motherPatCode?:number
    checkValidation?:number
    oldCode: string;
    customCode: string;
    RegBirthDataSerial?:number
    // name area
    age?:number
    dateHijri?: Date;
    fnameAr: string;
    fnameEn: string;
    snameAr: string;
    snameEn: string;
    tnameAr: string;
    tnameEn: string;
    lnameAr: string;
    lnameEn: string;
    fullnameAr?: string;
    fullnameEn?: string;
    gender?: number;
    religionId?: number;
    maritalStatus?: number;
    birthDate?: Date;
    birthPlace?: string;
    // address area 
    nationalityId?: number;
    countryCode?: number;
    govCode?: number;
    cityCode?: number;
    villageCode?: number;
    fullAddressAr?: string;
    fullAddressEn?: string;
    identityType?: number;
    identityValue?: string;
    bloodGroup?: number;
    rhValue?: number;
    contractId?: number;
    contractNameAr?: string;
    contractNameEn?: string;
    parentId?: number;
    fatherName?: string;
    motherName?: string;
    mortalityDate?: Date;
    fileNo?: string;
    stopFlag?: number;
    vipFlag?: number;
    //change user data
    changeType?: number;
    mortaliyFlag?: number;
    mailAddress?: string;
    mobile?: number;
    homePhone?: number;
    titleCode?: number;
    employeeId?: number;
    vipLevel?: number;
    nickName?: string;
    villageNameAr: string;
    villageNameEn: string;
    floorCode?:number
  
    cityNameAr: string;
    cityNameEn: string;
  
    countryNameAr: string;
    countryNameEn: string;
  
    govNameAr: string;
    govNameEn: string;
  
    nationalityNameEn: string;
    nationalityNameAr: string;
  
    genderNameAr: string;
    genderNameEn: string;
  
    religionNameAr: string;
    religionNameEn: string;
  
    parentEn: string;
    parentAr: string;
  
    titleNameEn: string;
    titleNameAr: string;
  
    identityEn: string;
    identityAr: string;
  
    employeeEn: string;
    employeeAr: string;
  
    bloodGroupAr: string;
    bloodGroupEn: string;
  
    maritalStatusEn: string;
    maritalStatusAr: string;
  
    relativeDegree?: number;
    familyCount?: number;
  
    contractsAr?: string;
    contractsEn?: string;
    // calculated
    ageAr?: string;
    ageEn?: string;
    // search parms
    fastSearchData: string;
    offset?: number;
    pageSize?: number;
    rowsCount?: number;
    bornWeight?: number;
    newBornPatCode?: number;
    statusType?: number;
    ngbFromDate?: Date;
    ngbToDate?: Date;
    base64?: string;
    docPath?: string;
    savePlaceType?: number;
    mergedFlag?: number;
  
    mergedByPatCode?: number;
    haveSpecialNeed?: number;
    specialNeedType?: number;
    specialNeedDesc?: string;
    cCCallBeneficiaryCode?: number;
    // user login for patient
    userName?: string;
    password?: string;
    confirmedUser?: number;
    securityQuestion?: string;
    answer?: string;
  
    docId?: number;
    startDate?: any;
  
    activationCode?: string;
    activated?: boolean;
    registerStep?: number;
    MembershipCardNo?: string;
    branchNameAr?:string;
    branchNameEn?:string;

  }
  export interface IPromotionsMsgLog {
    serial?: number;
    promotionCode?: number;
    patCode?: number;
    message?: string;
    sentDate?: Date;
    sender?: number;
    msgPrice?: number;
    rowsCount?: number;
    mobile?: number;
    callDataSerial?: number
    messageType?: number;
    regPatMedicalStepsSerial?: number;
    clinicReservationSerial?: number;
  }
  export interface TherapeuticCards {
  
    code: number;
    contractId?: number;
    cardNo?: string;
    patientCode: number;
    startDate?: any;
    endDate: any;
    policyNumber: string;
    eligibilityNo?: number;
  }
  export interface PatientData {
    patient?: Patient;
    familyDetail?: FamilyDetail[];
    familyPatients?: Patient[];
    therapeuticCards: TherapeuticCards;
    docManagementData?: any;
    patients?: Patient[];
    emrPatHistory ?: EmrPatHistory
  }
  export interface FamilyDetail {
  
    serial: number;
    relationDegree: number;
    parentId: number; 
    patientCode: number;
    rowStatus:number;
    patientNameAr: string;
    patientNameEn: string;
    relativeNameAr: string;
    relativeNameEn: string;
    fullnameAr:string;
    fullnameEn:string;
  }
  
  // Emr History Interface
  export interface EmrPatHistory {
    serial: number;
    visitSerial: number;
    historycode: any;
    historyText: string;
    type: number;
    startDate: Date;
    endDate: Date;
    notes: string;
    family: number;
    past: number;
    serviceCode: number;
    drugMaterialCode: number;
    drugMaterialText: string;
    drugDosageCode: number;
    drugDostageText: string;
    drugFrequancyCode: number;
    drugFrequancyText: string;
    deleteStatus: number;
    userName?: string;
    userID?: number;
    historyTypeEn?: string;
    historyTypeAr?: string;
    nameEn?: string;
    nameAr?: string;
  }
import { Injectable } from '@angular/core';
import { IIdentity } from '../blocks';
import { IName } from '../blocks/names';
import { Patient, PatientData } from '../patient-portal/portal-login/portal-login-interface';
import { HttpGeneralService } from '../shared';
import { CONFIG } from '../shared/config';

//import { IMedicalFilePlace} from '../medicalfileplace/medicalfileplace.service';
export enum EntityStatus {
    add = 1,
    edit = 2
}
export interface Employee {

    code: number;
    customCode: number;
    branchId: number;
    fnameAr: string;
    fnameEn: string;
    snameAr: string;
    snameEn: string;
    tnameAr: string;
    tnameEn: string;
    lnameAr: string;
    lnameEn: string;
    fullnameAr: string;
    fullnameEn: string;
    gender: number;
    religionId: number;
    socialStatus: number;
    milirityStatus: number;
    birthDate: Date;
    birthPlace: string;
    nationalityId: number;
    countryCode: number;
    govCode: number;
    cityCode: number;
    villageCode: number;
    addressAr: string;
    addressEn: string;
    identityType: number;
    identityValue: string;
    bloodGroup: string;
    rhValue: number;
    mobile: string;
    mailAddress: string;
    titleCode: number;
    medicalNo: number;
    shortNameAr: string;
    shortNameEn: string;
    updateDate: Date;
    updateUser: number;
    // regDate: Date;
    regUser: number;
    state: EntityStatus;
    // extended properity
    villageNameAr: string;
    villageNameEn: string;
    cityNameAr: string;
    cityNameEn: string;
    employeeNameAr: string;
    employeeNameEn: string;
    govNameAr: string;
    govNameEn: string;
    countryNameEn: string;
    countryNameAr: string;
    countryFlag:string;
    nationalityEn: string;
    nationalityAr: string;
    genderNameAr: string;
    genderNameEn: string;
    religionNameAr: string;
    religionNameEn: string;
    depNameAr:string;
    hrJobsNameAr:string;
    parentEn: string;
    parentAr: string;
    titleNameEn: string;
    titleNameAr: string;
    identityEn: string;
    identityAr: string;
    patientEn: string;
    patientAr: string;
    maritalStatusNameAr: string;
    maritalStatusNameEn: string;
    fullNameAr: string;
    fullNameEn: string;
    oldCode: number;
    fastSearchData: any;
    dateHijri?: Date;
    offset?: number;
    pageSize?: number;
    rowsCount?: number;

    fullAddressAr?: string;
    fullAddressEn?: string;
    nationalityNameEn: string;
    nationalityNameAr: string;
    accountNo: number;
    haveFees: boolean;
    endOfHired;
    jopId: number;
    depCode:number;
    hireDate:number;

    hasAttend:boolean;
    payrollSystem:string;
    hourValue:number;
    hourValType:number;
    hasPenalityList:number;
    penalityListCode:number;
    dailyWorkHour:number;
    medicalData:number;
    medicalType:number;
    defaultPayRoll:number;
    costCenterCode:number

}

export interface PatCancel {
    patCode: number;
    fullNameAr?: string;
    FullNameEn?: string;
    identityType?: number;
    identityValue?: number;
}

export interface IAddress {
    countryCode: number;
    countryNameEn: string;
    countryNameAr: string;

    govCode: number;
    govNameEn: string;
    govNameAr: string;

    cityCode: number;
    cityNameEn: string;
    cityNameAr: string;

    villageCode: number;
    villageNameEn: string;
    villageNameAr: string;

    nationalityId: number;
    mobile: string;
    nationalityNameEn: string;
    nationalityNameAr: string;

    fullAddressAr: string;
    fullAddressEn: string;
}
export interface PatientVM extends Patient {
    name: IName;
    therapeuticCards: TherapeuticCards;
    address: IAddress;
    identity: IIdentity;
    dateHijriNgb: any;
    birthDateNgb: any;
    mortalityDateNgb: any;
    visitType: number;
    visitStatus: number;
    visitsList?:string
    companyType: number;
    billNotExtracted: number;
    namingTranslationSettings: number;
    addressAr?: string;
    addressEn?: string;
    providerUrl ?: string;
    MembershipCardNo?: string
}
export interface TherapeuticCards {

    code: number;
    contractId?: number;
    contractNotRest?: number;
    cardNo?: string;
    patientCode: number;
    startDate?: any;
    endDate: any;
    policyNumber:string;
    eligibilityNo?: number;
    patSharingPercentFromCardFlag?:number; 
    inTransferBodiesSerial?:number; 
}

const patientsUrl = CONFIG.baseUrls.patients;
///patent cancel url
const patientCancelUrl = CONFIG.baseUrls.patCancel;


const mdfUrl = CONFIG.baseUrls.MedicalFilePlace;


// employees
let employeesUrl = CONFIG.baseUrls.employees;

@Injectable()
export class PatientService {


    constructor(
        private httpGeneralService: HttpGeneralService) {
    }
    /***********************************************************************
     * used to return prototype from patient object model with init all prop
     */

    getPatientProtoType(): PatientVM {
        const _name = <IName>{};
        const _address = <IAddress>{};
        const _identity = <IIdentity>{};

        return {
            code: 0,
            oldCode: '',
            customCode: '',
            fnameAr: '',
            fnameEn: '',
            snameAr: '',
            snameEn: '',
            tnameAr: '',
            tnameEn: '',
            lnameAr: '',
            lnameEn: '',
            fullnameAr: '',
            fullnameEn: '',
            gender: 0,
            religionId: 0,
            maritalStatus: 0,
            birthDate: null,
            birthPlace: '',
            nationalityId: 0,
            countryCode: 0,
            govCode: 0,
            cityCode: 0,
            villageCode: 0,
            fullAddressAr: '',
            fullAddressEn: '',
            identityType: 0,
            identityValue: null,
            bloodGroup: 0,
            rhValue: 0,
            contractId: 0,
            contractNameAr: '',
            contractNameEn: '',
            parentId: null,
            fatherName: '',
            motherName: '',
            mortalityDate: null,
            fileNo: '',
            stopFlag: 0,
            vipFlag: 0,
            mortaliyFlag: 0,
            mailAddress: '',
            mobile: 0,
            homePhone: 0,
            titleCode: 0,
            employeeId: 0,
            vipLevel: 0,
            nickName: '',
            familyCount: 0,
            villageNameAr: '',
            villageNameEn: '',

            cityNameAr: '',
            cityNameEn: '',

            countryNameAr: '',
            countryNameEn: '',

            govNameAr: '',
            govNameEn: '',

            nationalityNameEn: '',
            nationalityNameAr: '',

            genderNameAr: '',
            genderNameEn: '',

            religionNameAr: '',
            religionNameEn: '',

            parentEn: '',
            parentAr: '',

            titleNameEn: '',
            titleNameAr: '',

            identityEn: '',
            identityAr: '',

            employeeEn: '',
            employeeAr: '',

            bloodGroupAr: '',
            bloodGroupEn: '',

            maritalStatusEn: '',
            maritalStatusAr: '',

            relativeDegree: 0,
            fastSearchData: '',
            name: _name,
            address: _address,
            identity: _identity,
            dateHijriNgb: null,
            birthDateNgb: null,
            mortalityDateNgb: null,
            therapeuticCards: null,
            visitType: null,
            visitStatus: null,
            companyType: null,
            billNotExtracted: null,
            namingTranslationSettings: null,
            mergedByPatCode: null,
            haveSpecialNeed: null,
            specialNeedType: null,
            specialNeedDesc: ''
        };
    }

    getPatients() {
        return this.httpGeneralService.getWith(`${patientsUrl}`);
    }

    getPatient(id: string) {
        return this.httpGeneralService.getWith(`${patientsUrl}/${id}`);
    }

    getCCCallBeneficiarySimilarPat(id: string) {
        return this.httpGeneralService.getWith(`${patientsUrl}/${id}/GetCCCallBeneficiarySimilarPat`);
    }
    

    searchPatients(searchObj: Patient) {
        return this.httpGeneralService.add(searchObj, `${patientsUrl}/searchSp`);
    }
    searchInPatients(searchObj: Patient) {
        return this.httpGeneralService.add(searchObj, `${patientsUrl}/searchInPatients`);
    }
    ////////////////fun to getHigridate
    getHigriDate(searchObj: Patient) {
        return this.httpGeneralService.add(searchObj, `${patientsUrl}/getHigridate`);
    }

    ////////////////fun to getGregorianDate from higri
    getGregorianDate(searchObj: Patient) {
        return this.httpGeneralService.add(searchObj, `${patientsUrl}/getGregorianDate`);
    }



    addPatient(patient: PatientData) {
        return this.httpGeneralService.add(patient, `${patientsUrl}`);

    }

    modifyPatientsData(patients: Patient[]) {
        return this.httpGeneralService.addCollection(patients, `${patientsUrl}/Patients`);
    }

    /////////////////////////////////////////////////#ibra patient cancel
    cancelPatient(patCancel: PatCancel) {
        return this.httpGeneralService.add(patCancel, `${patientCancelUrl}`);
    }

    updatePatient(PatientData: PatientData) {
        return this.httpGeneralService.update(PatientData.patient.code, PatientData, `${patientsUrl}`);
    }

    deletePatient(patient: Patient) {
        return this.httpGeneralService.delete(patient.code, `${patientsUrl}`);
    }

    addMedicalFilePlace(MFPlace) {
        return this.httpGeneralService.add(MFPlace, `${mdfUrl}`);
    }

    getMedicalFilePlace(serial: number = 0) {
        return this.httpGeneralService.getWith(`${mdfUrl}/${serial}`);
    }

    deleteMedicalFilePlace(serial: number) {
        return this.httpGeneralService.delete(serial, `${mdfUrl}`);
    }


    // new code
    searchEmps(searchObj: Employee) {
        return this.httpGeneralService.search(searchObj, `${employeesUrl}`);
    }

    modifyPatientNameIdentity(patient: Patient) {
        return this.httpGeneralService.add(patient, `${patientsUrl}/ModifyPatientNameIdentity`);

    }
}

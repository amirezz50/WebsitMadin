import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
let hrApplicantMainDataUrl = CONFIG.baseUrls.hrApplicantMainData;

export interface ApplicantPanner {
    fullnameAr: string,
    fullnameEn: string,
    birthDate: number,
    addressAr: string,
    hireDate: number;
    workStartDate: number;
    jobNameAr: string;
    jobNameEn: string;
    jobTypeNameAr: string;
    jobTypeNameEn: string
    identityAr: string;
    identityEn: string;
    countryNameAr: string;
    countryNameEn: string;
    nationalityAr: string;
    nationalityEn: string;
    contractTypeAr: string;
    contractTypeEn: string;
    workStatusAr: string;
    workStatusEn: string;
    genderAr: string;
    genderEn: string;
    departmentAr: string;
    departmentEn: string;
    ageAr: string;
    managementAr: string;
    managementEn: string;
    maritalStatusAr: string;
    maritalStatusEn: string;
    religionAr: string;
    religionEn: string;
}

@Injectable()
export class ApplicantPannerService {
    constructor(private httpGeneralService: HttpGeneralService) { }

    getApplicantPannerData(id: number) {
        return this.httpGeneralService.get(id, `${hrApplicantMainDataUrl}/ApplicantPannerDataLoad`)
    }
}


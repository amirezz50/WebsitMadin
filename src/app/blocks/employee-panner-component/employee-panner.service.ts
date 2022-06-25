import { Injectable } from '@angular/core';
import {  HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
let employeesUrl = CONFIG.baseUrls.employees;

export interface EmpPanner {
  fullnameAr:string,
  fullnameEn:string,
  birthDate:number,
  addressAr:string,
  hireDate:number;
  workStartDate:number;
  jobNameAr:string;
  jobNameEn:string;
  jobTypeNameAr:string;
  jobTypeNameEn:string
  identityAr:string;
  identityEn:string;
  titleNameAr:string;
  titleNameEn:string;
  countryNameAr:string;
  countryNameEn:string;
  nationalityAr:string;
  nationalityEn:string;
  contractTypeAr:string;
  contractTypeEn:string;
  workStatusAr:string;
  workStatusEn:string;
  genderAr:string;
  genderEn:string;
  departmentAr:string;
  departmentEn:string;
  ageAr:string;
  defaultPayRoll:number
}
@Injectable()
export class EmployeePannerService {
    constructor(private httpGeneralService: HttpGeneralService) {}

    getEmployeePannerData(id: number) {
      return this.httpGeneralService.get(id, `${employeesUrl}/EmployeePannerDataLoad`)
  }
}


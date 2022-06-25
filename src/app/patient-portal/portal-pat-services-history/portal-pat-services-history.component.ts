
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PatientParms } from '../../shared/search-params';
import { UserSessionService, spliceArrByPropVal } from '../../shared';
import { PortalAuthService } from '../portal-login/portal-auth.service';
import { EnumServiceType } from '../../enumeration/enum-service-type';
import { EnumPatServiceStatus } from '../../enumeration/enum-pat-service-status';
import { NgxQrcodeErrorCorrectionLevels, NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { FormControl } from '@angular/forms';
import { ServiceHistoryService } from '../../portalServicesUsed/service-history.service';
declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


export class OrderPatientAction {
  public static Order_Pat_Service: string = 'Order_Pat_Service';
  public static Order_Next_AppCode: string = 'Order_Next_AppCode';
  public static Order_Update_Service_Status: string = 'Order_Update_Service_Status';
  public static Order_Col_Samp_Emp: string = 'Order_Col_Samp_Emp';
  // public static Order_Pat_Service_Multi: string = 'Order_Pat_Service_Multi';
  // public static Order_Service_Mode_Type: string = 'Order_Servcie_Mode_Type';
  public static Order_Work_Flow: string = 'Order_Work_Flow';
  public static Order_Patient_Sevices_With_Same_Status: string = 'Order_Patient_Sevices_With_Same_Status';// used to get all service with same status from code not from users selections in write and review steps

  public static Order_Deliver_Result = 'Order_Deliver_Result';
  public static Order_Workflow_Change = 'Order_Workflow_Change';
  public static Order_Hide_Show_Workflow = 'Order_Hide_Show_workflow';
  public static Order_Filtered_App_Code = 'Order_Filtered_App_Code';
  public static Order_Full_Workflow = 'Order_Full_Workflow';
  public static Order_All_Workflows = 'Order_All_Workflows';
  public static Order_Permission_AppCodes = 'Order_Permission_AppCodes';
}

@Component({
  selector: 'app-portal-pat-services-history',
  templateUrl: './portal-pat-services-history.component.html',
  styleUrls: ['./portal-pat-services-history.component.css']
})
export class PortalPatServicesHistoryComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  patientParms: PatientParms = <PatientParms>{};
  patServices: any[] = [];
  breadCrumbData: any;
  visitedActions = {};
  activeAction = 0;
  targetedService: any = <any>{};
  p: number = 0
  @ViewChild('pdfTable', { static: false }) _pdfTable: any;
  //qrcode
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qr_value = 'OrderSerial';

  constructor(
    private serviceHistoryService: ServiceHistoryService,
    private _auth: PortalAuthService,
    private _USS: UserSessionService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    if (this._auth.getPatientCode) {
      this.patServicesLoad(this._auth.getPatientCode);
    }
    this.creatpsearch();
  }

  patServicesLoad(patCode: number) {
    this.patientParms = {};
    this.patientParms.patCode = patCode;
    this.serviceHistoryService.portalPatServicesLoad(this.patientParms)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res:any) => {
        this.patServices = res ? res.data : [];
        this.searchOnAll = Object.assign([], this.patServices);

      });
  }
  showQRCode: boolean = false;
  onIconActionClick(action: any, Service: any) {
    this.setBreadCrumb('in', action.serial, `${action['nameAr']} ( ${Service['serviceNameAr']} ) `
      , `${action['nameEn']} ( ${Service['serviceNameEn']} ) `, action.serial);
    this.targetedService = Service;
    switch (action.serial) {
      case 2326:// show  result
        this._USS.setSessionKey(OrderPatientAction.Order_Next_AppCode, '2326')
        this._USS.setSessionKey(OrderPatientAction.Order_Pat_Service, { service: [Service] });
        break;
      case 6733:
        this.qr_value = `${Service.orderMasterSerial}`;
        this.showQRCode = true;
        break;
      default:
        break;
    }
  }

  getActiveAction(_row: any, appCodes: any[]) {
    let activeActions = [];
    if (_row) {
      if (_row.serviceType != EnumServiceType.Laboratory && _row.serviceType != EnumServiceType.Radiology) {
        appCodes = spliceArrByPropVal(appCodes, 'serial', '2326');
      }
      if (_row.serviceType == EnumServiceType.Laboratory && (_row.serviceStatusCode != EnumPatServiceStatus.ResultInsured && _row.serviceStatusCode != EnumPatServiceStatus.ResultPrinted)) { // lab result confiermed
        appCodes = spliceArrByPropVal(appCodes, 'serial', '2326');
      }
      if (_row.serviceType == EnumServiceType.Radiology && _row.serviceStatusCode != EnumPatServiceStatus.RadReviewReport) {
        appCodes = spliceArrByPropVal(appCodes, 'serial', '2326');
      }
      activeActions = appCodes;
      return activeActions;
    }
  }

  //#region breadcrumb area
  onBreadCrumbClick(node) {
    if (node && node.code != 0) {
      this.activeAction = node.code;
      this.visitedActions[node.code] = true;
    } else {
      this.activeAction = 0;
      this.visitedActions[node] = true;
    }

  }

  setBreadCrumb(type: string, code, nameAr?, nameEn?, areaName?) {
    this.breadCrumbData = Object.assign({},
      { type: type, code: code, nameAr: nameAr, nameEn: nameEn, areaName: areaName });
    this.visitedActions[code] = true;
    this.activeAction = code;
  }
  //#endregion
  searchInputControl = new FormControl();
  creatpsearch() {
    this.searchInputControl.valueChanges.subscribe(x => {
      debounceTime(100);
      this.searchOnfavList(x);
    })
  }
  setdata(row: any) {
    this._USS.setSessionKey(OrderPatientAction.Order_Pat_Service, { service: [row] });
  }
  searchOnAll: any = [];
  searchOnfavList(value: string) {
    let exp = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    if (value && value.length > 0) {
      this.patServices = [];
      if (exp.test(value) || value == '') {
        this.patServices = this.searchOnAll.filter(s => s['serviceNameAr'].includes(value));
      }
      else {
        if (isNaN(+value)) {
          this.patServices = this.searchOnAll.filter(s => s['serviceNameAr'].includes(value));
        } else {
          this.patServices = this.searchOnAll.filter(s => s['customServiceCode'] == +value);
        }
      }
    }
    if (value.length == 0) {
      this.patServices = this.searchOnAll;
    }
  }
  report
  getPatientReport(service: any) {
    this.serviceHistoryService
      .writtenReportsSearch({
        editMode: 1,
        regPatServiceSerial: service.serial
      }).subscribe((res: any) => {
        if (res.returnFlag && res.data.length > 0) {
          this.report = res['data'][0];

          const htmlObject = document.createElement('div');
          htmlObject.innerHTML = this.report.htmlContent;
          //     document.body.appendChild(htmlObject);
          // document.getElementById("main").appendChild(htmlObject);
          var html = htmlToPdfmake(htmlObject.innerHTML);
          const documentDefinition = { content: html };

          setTimeout(() => {
            pdfMake.createPdf(documentDefinition).download();

          }, 200);

        }
      },
        err => console.error(err),
        () => {

        });
  }


}



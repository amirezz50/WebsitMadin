import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectizeComponent } from '../selectize';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService } from '../../shared';

@Component({
  selector: 'lab-search',
  templateUrl: './lab-search.component.html',
  styleUrls: ['./lab-search.component.css']
})
export class LabSearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('sheetSelectize', { static: false }) sheetSelectize: SelectizeComponent;
  @ViewChild('serviceSelectize', { static: false }) serviceSelectize: SelectizeComponent;

  serviceCode: number;
  serviceSheets: any[] = [];
  currentService: any = <any>{};

  constructor(
    public translate: TranslateService,
    private _uss: UserSessionService) { }

  ngOnInit() { }

  getSelectedService(serv: any) {
    if (serv && serv.code) {
      this.currentService = serv;
      this.serviceCode = serv.code;

      this.sheetSelectize.clear();
      this.sheetSelectize.clearItems();
      this.sheetSelectize.setFastSearchObjDynamicKey('ServiceCode', serv.code);
    }
  }

  addSelectedSheetFromSelectize(sheets) {
    sheets.forEach(sheet => {
      const item = this.serviceSheets.find(sh => sh.sheetCode === sheet.code);
      if (!item) {
        this.serviceSheets.unshift({
          serial: sheet.code,
          serviceCode: this.currentService.code,
          serviceNameAr: this.currentService.nameAr,
          serviceNameEn: this.currentService.nameEn,
          sheetCode: sheet.code,
          sheetDescAr: sheet.nameAr,
          sheetDescEn: sheet.nameEn,
          unitNameEn: sheet.unitNameEn,
          unitNameAr: sheet.unitNameAr,
          appearOrder: undefined,
          type: sheet.type,
          formulaName: 'No Input',
          dataStatus: 1,
          isNew: true,
          visiable: 1,
          sheetValue: null
        } as any);
      }
    });
  }

  removeNewServiceSheetFromUi(item) {
    const temp = this.serviceSheets.find(sheet => sheet.sheetCode === item.sheetCode);
    this.serviceSheets.splice(this.serviceSheets.indexOf(temp), 1);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onBtnsClicked(actionSerial: number) {
    switch (actionSerial) {
      case 2183:
        this.outPutLabSearchData();
        break;
      case 7:
        this.clear();
        break;
    }
  }

  clear() {
    // this.serviceCode = null;
    // this.serviceSheets = [];
    // this.currentService = <any>{};
    this._uss.closeModalKey('LabSearchComponent', { serviceCode: null, serviceSheets: [] });
  }

  outPutLabSearchData() {
    // here -- dealing with data to emit it
    this._uss.closeModalKey('LabSearchComponent', { serviceCode: this.serviceCode, serviceSheets: this.serviceSheets });
    // this.clear();
  }

}

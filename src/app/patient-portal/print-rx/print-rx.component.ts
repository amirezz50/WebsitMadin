import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PrintComponent } from '../../print-component';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService, StockParms } from '../../shared';
import { takeUntil } from 'rxjs/operators';
import { PrintRxService } from './print-rx.service';

@Component({
  selector: 'app-print-rx',
  templateUrl: './print-rx.component.html',
  styleUrls: ['./print-rx.component.css']
})
export class PrintRxComponent implements OnInit {
  width: number = 20;
  height: number = 22;
  rxDesc = [];
  rxInfo: any = <any>{};
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private unsubscribe = new Subject();
  stockModuleSettings: {};
  PrintByGenericName: number;
  rxPrintSetting: number;
  rxMedicayionData: any;
  rxMasterSerialPrint: any;
  _StockParms = <StockParms>{};//============_StockParms===================================/////
  _rxMasterSerial: number;

  @ViewChild('printComponent', { static: false }) printComponent: PrintComponent;
  constructor(
      private  _RxDetailService:PrintRxService,
      private _userSessionService: UserSessionService,
      public translate: TranslateService
      ) { }

  ngOnInit() {
    
      this._userSessionService.subscribeToKey$("rxMasterPrint").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(res => {
              this.rxMasterSerialPrint = res.value
              if (this.rxMasterSerialPrint != (undefined || null))
              this.rxPrint(this.rxMasterSerialPrint);
          });

      this.rxMasterSerialPrint = this._userSessionService.getSessionKey("RxMasterPrintData")
      if (this.rxMasterSerialPrint&&this.rxMasterSerialPrint.rxMasterSerial != (undefined || null)) {
          this.rxPrint(this.rxMasterSerialPrint);
      }
      //-----------------------subscribtion area--------------------------------------
      //-----------------------subscribtion area--------------------------------------

      this._userSessionService
          .getSessionKey$('RxMasterPrintData')
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(res => {
              this.rxMasterSerialPrint = res.value;
              if (this.rxMasterSerialPrint != (undefined || null))
              this.rxPrint(this.rxMasterSerialPrint);
          });
  }
  rxPrint(rxmaster: any) {

      this.rxInfo = <any>{};
      this.rxDesc = [];
      this._StockParms.rxMasterSerial = rxmaster;
      if (rxmaster != (undefined || null))
          this._RxDetailService.rxAllRxMediactionsReport(this._StockParms)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                  v => {
                      if (v.data && v.data.length > 0) {
                          this.rxDesc = v.data;
                          this.rxInfo = v.data[0];
                          console.log(this.rxInfo);
                          setTimeout(() => { if (this.printComponent) { this.printComponent.PrintView() } }, 200);
                      }
                  },
                  error => console.log(error),
                  () => {
                      null
                  });
  }
  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }



  delete(rxDesc: any) {

  }

}

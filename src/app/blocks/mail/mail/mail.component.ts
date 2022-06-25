import { ModalService } from './../../modal/modal.service';
import { Component, OnInit, NgModule, Input, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UserSessionService, StockParms, SharedModule } from '../../../shared';
import { Subject } from 'rxjs';
import { HttpRequest, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MailService } from './mail.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
// import * as jsPDF from 'jspdf'; 
import { ToastService } from '../../toast';
import { StepperComponent } from '../../stepper';
import { BlocksModule } from '../../blocks.module';
import { PrintComponent } from '../../../print-component';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public progress: number;
  public formData: any;
  @Input() po_OrderMsgBody: any;
  hideen: number = 1;
  @Input() Po_OrderMsgSubject: any;
  @ViewChild('contentHtml', { static: false }) contentHtml: ElementRef;
  uploadForm: FormGroup;
  formBuilder: any;


  items = [];

  row: any = <any>{};
  poOrderSupplySerial: any = <any>{};
  allowReset: number;
  @ViewChild('printComponent', { static: false }) printComponent: PrintComponent;
  @Input() myStepNumber: number;
  @Input() PoOrderFlageForPrint: any;
  patientFlag: any;
  @Input() stepperComponent: StepperComponent;
  toEmailAddress: any;

  constructor(public translate: TranslateService,
    private http: HttpClient,
    private _MailService: MailService,
    private _ToastService: ToastService,
    private _userSessionService: UserSessionService,) { }
  public MailObj: MailObj = <MailObj>{};
  ngOnInit() {
    this._userSessionService.subscribeToKey$('MailBindObj').pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys && keys.value) {
          this.MailObj = keys.value
          this.MailObj.htmlContent = this.po_OrderMsgBody;
          this.MailObj.subject = keys.value['Subject'];
          this.MailObj.transSerial = keys.value['TransSerial'];
          if (keys.value['To']) {
            this.MailObj.to = keys.value['To']
            this.toEmailAddress = keys.value['To'];
            this.getGetpoOrderSupplyResetInfo(this.MailObj.transSerial);
          }
          if (this.MailObj == undefined) {
            this._ToastService.activateMsg(" you must complete mail options");;
          }
          this.MailObj['name'] = this.MailObj.subject + '.pdf'
          this.MailObj['type'] = "application/pdf"

        }
      }
      )

    this._userSessionService.subscribeToKey$('POORDERSUPPLYSERIAL')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys: any) => {
        if (keys.value) {
          this.getGetpoOrderSupplyResetInfo(keys.value);
        }
      });

  }
  getGetpoOrderSupplyResetInfo(PoOrderSupCode) {
    var hgh = <any>this._userSessionService.getSessionKey("IFASSETS");
    var notes = ""
    if (hgh && hgh['poOrderType'] == 3) {
      notes = "Assets"
    }
    if (PoOrderSupCode != undefined || PoOrderSupCode != null) {
      var prem: StockParms = {
        serial: PoOrderSupCode,
        notes: notes,
        queryCode: 6
      }
      this.row = <any>{};
      this.items = [];
      // this._ExaminationSupplyService.getPoOrderSupply(prem, notes)
      //   .pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe(
      //     r => {
      //       if (r) {
      //         var hgh = <any>this._userSessionService.getSessionKey("IFASSETS");
      //         if (hgh && hgh['poOrderType'] == 3) {
      //           if (r.data2 && r.data2.length > 0) {
      //             this.row = r.data2[0];
      //           }
      //           if (r.data1 && r.data1.length > 0) {
      //             this.items = r.data1;
      //           }
      //         }
      //         else {
      //           if (r.data && r.data.length > 0) {
      //             this.row = r.data[0];
      //           }
      //           if (r.data1 && r.data1.length > 0) {
      //             this.items = r.data1;
      //           }
      //         }

      //       }
      //     }
      //     , error => console.log(error),
      //     () => null
      //   );
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }

  upload(files) {
    if (files.length === 0)
      return;
    this.formData = files[0]
    this.MailObj.name = files[0].name
    this.MailObj.size = files[0].size
    this.MailObj.type = files[0].type

  }

  openInNewWindow() {
    /// go to print 
    this._userSessionService.setSessionKey("GoToTabOfSerial", 1013)
  }

  saveFile() {
    const content = this.contentHtml.nativeElement;
    this.MailObj.htmlContent = content.innerHTML
  }

  sentMail() {
    this.saveFile();
    if (!this.MailObj.to) {
      this.MailObj.to = this.toEmailAddress;
    }
    this._MailService.sentEmail(this.MailObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(c => {

        if (c) {
          this.openInNewWindow();
          setTimeout(() => {
            if (this.printComponent) {
              this.printComponent.PrintView()
            }
          }, 200);
          this._ToastService.activateMsg(c)
        }
      });
  }
}
export interface MailObj {
  htmlContent: string;
  from: string;
  to: string;
  subject: string;
  name: string;
  size: number;
  type: any;
  supplierCode: number;
  transSerial: number;
}






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BlocksModule,
    ReactiveFormsModule,
    TranslateModule.forChild(), CKEditorModule,
  ],
  declarations: [

    MailComponent,
    //EmployeesPannerComponent
  ],
  exports: [
    MailComponent,
  ], providers: [
    MailService
  ],
  entryComponents: [MailComponent]

})

export class MailModule { }


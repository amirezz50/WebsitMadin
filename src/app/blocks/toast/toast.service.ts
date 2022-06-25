import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { AlertsService, AlertSettings } from '../ui-component/ng2-alerts/JasperoAlertsModule';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ToastService {
  constructor(
    public translate: TranslateService,
    // private _alert: AlertsService,
    private toastr: ToastrService
  ) { }
  public activate(
    message?: string,
    title?: string,
    messageType?: number
  ): void { }
  // ****************************************************************
  public activateMsg(message?: string, issue?: string) {
    if (!issue) {
      issue = '';
    }
    this.translate.get(message).subscribe(msg => {
      this.toastr.error('', msg + ' ' + issue, { closeButton: true });
      // this.activate(msg);
    });
  }

  public toastMsg(msg?: string, title?: string, type?: 'Error' | 'Warn' | 'Success' | 'Info') {

    if (type == 'Success') {
      this.toastr.success(msg, title, { closeButton: true });
    } else if (type == 'Warn') {
      this.toastr.warning(msg, title, { closeButton: true });
    } else if (type == 'Info') {
      this.toastr.info(msg, title, { closeButton: true });
    } else {
      this.toastr.error(msg, title, { closeButton: true });
    }

  }

  public activateRequestError(message?: string, error?: { error: string, title: string, stackTrace: string, data: any }) {
    if (error && error.error) {
      this.toastr.error(`${error.error}`, error.title, {
        closeButton: true,
        timeOut: 10000,
        tapToDismiss: false,
        easeTime: 700,
        positionClass: 'toast-top-full-width'
      });
      this.toastr.error(`${error.stackTrace}`, 'stackTrace', {
        closeButton: true,
        timeOut: 10000,
        tapToDismiss: false,
        easeTime: 700,
        positionClass: 'toast-top-full-width'
      });
    } else {
      this.toastr.error(message, '', {
        closeButton: true,
        timeOut: 10000,
        tapToDismiss: false,
        easeTime: 700,
      });
    }
  }
  /** *********************************************************
   * return true if msgId = 5
   * else return continue flag {true , false}
   */
  public HandelDbMessages(messages?: Message[]): boolean {
    if (messages && messages.length > 0) {
      let  messageType = messages[0].msgID == 5 ? 1 : 2;
      messageType = messages[0].msgID == 44 ? 3  : messageType;
      if (messageType == 1) {
        if (this.translate.currentLang == 'en') {
          this.toastr.success(messages[0].msgBodyEn, messages[0].msgHeaderEn, {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }

        if (this.translate.currentLang == 'ar') {
          this.toastr.success(messages[0].msgBodyAr, messages[0].msgHeaderAr, {
            closeButton: true,
            positionClass: 'toast-top-left'
          });
        }
      }else if (messageType == 3) {
        if (this.translate.currentLang == 'en') {
          this.toastr.warning(messages[0].msgBodyEn, messages[0].msgHeaderEn, {
            closeButton: true,
            positionClass: 'toast-top-right'
          });
        }

        if (this.translate.currentLang == 'ar') {
          this.toastr.warning(messages[0].msgBodyAr, messages[0].msgHeaderAr, {
            closeButton: true,
            positionClass: 'toast-top-left'
          });
        }
      }
       else {
        if (!window.location.pathname.includes('/portal/') )
          if (messages[0].msgID !== 5) {
            messages.forEach(element => {
              this.toastr.error(
                this.translate.currentLang == 'ar'
                  ? element.msgBodyAr
                  : element.msgBodyEn,
                this.translate.currentLang == 'ar'
                  ? element.msgHeaderAr
                  : element.msgHeaderEn,
                {
                  closeButton: true,
                  //extendedTimeOut: 6000,
                  positionClass: 'toast-top-center'
                }
              );
            });
            
          }
      }
      return (messages[0].msgID == 5 ||  messages[0].msgID == 44)   ? true : false;
    } else {
      return true;
    }
  }
}

export class Message {
  msgID: number;
  msgHeaderAr: string;
  msgHeaderEn: string;
  msgBodyAr: string;
  msgBodyEn: string;
}

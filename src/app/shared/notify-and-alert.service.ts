
import { finalize, catchError, map } from 'rxjs/operators';
import { HttpGeneralService } from './http-general.service';
import { Injectable, Type } from '@angular/core';

import { CONFIG } from './config';
import { NotifyMesseage, NotifySignalrService } from './notify-signalr.service';
import { HrParms, MessageService } from './shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExceptionService, SpinnerService } from '../blocks';

let hrAlertConditionsUrl = CONFIG.baseUrls.alertsApiController;

@Injectable()
export class AlertService {
  refrences = [];
  abnormal: number;
  sender: any;
  type: any;
  patientMobile: any;
  alertConditionsSerial: any;
  constructor(
    private httpgenser: HttpGeneralService,
    private signalrService: NotifySignalrService,
    private _http: HttpClient,
    private _exceptionService: ExceptionService,
    private _spinnerService: SpinnerService,
  ) { }

  _invokeAlertsMesseages(refrences, transaction, type: string) {
    this.refrences = refrences;
    for (var i = 0; i < this.refrences.length; i++) {
      if (this.refrences[i]['smsAlert']) {
        this.ssmEgy(this.refrences[i], transaction, type, this.refrences[i]['mobile']);
      }
      if (this.refrences[i]['insideAlert']) {
        this._invokeMsgSignalR(this.refrences[i], transaction, type, this.refrences[i]['requestSerial'], this.refrences[i]['overridelowerlevel'], this.refrences[i]['serial']);
      }
    }
  }

  ssmEgy(a, transaction, type, patientMobile?) {
    this.smsegyReq(a, transaction, type, patientMobile)
      .subscribe(msg => {
        var res = msg;
      });
  }

  smsegyReq(a, transaction, type, patientMobile?) {
    let body = '';

    let authUrl = `https://smsmisr.com/api/webapi/?username=F7bpeVQf&password=uqURwTZ6e8&language=2&sender=BIT News&mobile=${patientMobile}&message=${a.nameAr}&DelayUntil=2017-09-13-13-30`

    return this._http
      .post(authUrl, body
      ).pipe(
        map(res => {
          return res;
        }),
      );
  }

  _invokeMsgSignalR(a, transaction, type, _ActionSerial?, needDecision?, approvCycleTransSerial?) {
    const message: NotifyMesseage = {
      messageAr: a['nameAr'],
      messageEn: a['nameEn'],
      notifyDegree: this.abnormal == 1 ? 2 : 1,
      actionSerial: _ActionSerial,
      type: type,
      needDecision: needDecision,
      approvCycleTransSerial: approvCycleTransSerial
    };
    this.signalrService.invokeMesseage(a['empCode'], message);

  }
  mailSendGridAndTwilioWhatsApp(type, actionSerial?) {
    this.sentmailSendGridAndTwilioWhatsApp(type, actionSerial).subscribe(
      u => {
        var res = u;
      },
      error => { },
      () => {
        null
      });
  }
  sentmailSendGridAndTwilioWhatsApp(type?, _ActionSerial?: number) {
    var obj = <AlertSender>{
      type: type,
      actionSerial: _ActionSerial
    }
    return this.httpgenser.add(obj, `${hrAlertConditionsUrl}/getReciversMsgBody`);
  }


}
export interface AlertMesseage {
  whatNo?: string;
  msg?: string;
  phoneNo?: string;
  mailAddress?: string;
}

export interface AlertSender extends HrParms {
  alertConditionsSerial?: number;
  type?: string;
  needDecision?: number;
  requestDate?: Date;
  patientMobile?: string;
  actionSerial?: number;
  approvCycleTransSerial?: number;
}


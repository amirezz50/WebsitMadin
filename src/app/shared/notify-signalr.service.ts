import { ToastrService } from 'ngx-toastr';
import { HttpGeneralService } from './http-general.service';
import { Injectable } from '@angular/core';

import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { CONFIG } from './config';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { createAuthorizationHeader } from './utility';

const labSignalrHub = CONFIG.baseUrls.labSignalrHub;

@Injectable()
export class NotifySignalrService {
  private _hubConnection: HubConnection | undefined;
  notifications: NotifyVM[] = [];
  _notifications$ = new BehaviorSubject<NotifyVM>(undefined);
  notifications$ = this._notifications$.asObservable();


  constructor(
    private httpgenser: HttpGeneralService,
    private toastr: ToastrService,
    private _authService: AuthService
  ) { }

  public AddNotifications(res) {
    if (res instanceof Array) {
      let index = 0;
      res.forEach((element: NotifyVM) => {
        index = index + 1;
        setTimeout(() => this.AddNotify(element), index * 500)
      });
    }
  }

  public AddNotify(element) {
    if (element) {
      element.bodyNM = JSON.parse(element.body);
      this.notifications.push(element);
      this._notifications$.next(element);
      if (element['isDisplay'] != 1) {
        this.fireNotify(element.bodyNM);
      }

      //element --- object 
    }
    if (this.notifications && this.notifications.length > 0) {
      if (element['isDisplay'] != 1) {
        this.updateNotificationsIsRead(element);
      }
    }
  }
  updateNotificationsIsRead(element) {
    let temp = [];
    let loopNoti = [];
    loopNoti.push(element)
    for (var i = 0; i < loopNoti.length; i++) {
      let _NotifyVM = <NotifyVM>{};
      _NotifyVM.serial = loopNoti[i].serial
      _NotifyVM.displayDate = new Date();
      _NotifyVM.isDisplay = 1;
      _NotifyVM.isReaded = 0;
      temp.push(_NotifyVM);

    }
    // this.updateNotification(temp)
    //   .subscribe(c => {
    //     null
    //   });

  }
  connect(url?) {
    let urlall = '';
    if (!url) {
      urlall = CONFIG.updateOldUrl(labSignalrHub);
    }
    const user = this._authService.UserInfo;
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${url ? url : urlall}?userID=${user.empID}`, {
        accessTokenFactory: () => {
          return createAuthorizationHeader().Authorization;
        }
      })
      .configureLogging(signalR.LogLevel.Error)
      .build();
    this.start();
  }

  private start() {
    this._hubConnection.start().catch(err => {
      console.error(err.toString());
    });
  }

  listen(messageType = 'ReceiveMessage'): Observable<any> {
    // return Observable.create((observer: Observer<NotifyMesseage>) => {
    this._hubConnection.on(messageType, (data: any) => {
      if (data instanceof Array) {
        this.AddNotifications(data);
      } else {
        this.AddNotify(data);
      }
    });
    // });
    return this.notifications$;
  }

  invokeMesseage(receiver, messageData, messageName = 'SendMessage') {
    if (!this._hubConnection) {
      console.log('you must call connect first');
    }
    const user = this._authService.UserInfo;
    this._hubConnection.invoke(
      messageName, //massege
      user.empID.toString(), //sender
      receiver, //reciever
      messageData //massege object
    );
  }

  fireNotify(res: NotifyMesseage) {
    if (res.notifyDegree == 1) {
      this.toastr.info(res.messageAr, 'info', {
        positionClass: 'toast-bottom-right',
        closeButton: true,
        timeOut: 10000
      });
    } else if (res.notifyDegree == 2) {
      this.toastr.warning(res.messageAr, 'warning', {
        positionClass: 'toast-bottom-right',
        closeButton: true,
        timeOut: 10000
      });
    } else if (res.notifyDegree == 4) {
      this.toastr.error(res.messageAr, 'danger', {
        positionClass: 'toast-bottom-right',
        closeButton: true,
        timeOut: 10000,
        disableTimeOut: false
      });
    }
  }

  updateNotification(notifications: NotifyVM[]) {
    let hrAlertConditionsUrl = CONFIG.baseUrls.alertsApiController;
    return this.httpgenser.add(notifications, `${hrAlertConditionsUrl}/updateNotification`);
  }




}

export interface NotifyVM {
  serial?: number;
  notifyType?: number;
  header?: string;
  body?: string;
  bodyNM?: NotifyMesseage;
  sender?: number;
  receiver?: number;
  isReaded?: number;

  readDate?: Date;
  displayDate?: Date;
  isDisplay?: number;

  notifyMasterSerial?: number;
  dataStatus?: number;
}

export interface NotifyMesseage extends NotifyVM {
  messageAr?: string;
  messageEn?: string;
  notifyDegree?: number;
  type?: string;
  needDecision?: number;
  actionSerial?: number;
  approvCycleTransSerial?: number;
}

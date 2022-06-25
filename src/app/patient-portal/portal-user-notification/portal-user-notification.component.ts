import { Component, OnInit, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { UserSessionService } from '../../shared';
import { ModalService } from '../../blocks';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { PortalUserNotificationService } from './portal-user-notification.service';
import { not } from 'rxjs/internal/util/not';
import { PortalNotificationsAndMsgs } from './portal-user-notification-interface';
import { NewSignalrAlertService } from '../../shared/new-signalr-alert.service';

@Component({
  selector: 'app-portal-user-notification',
  templateUrl: './portal-user-notification.component.html',
  styleUrls: ['./portal-user-notification.component.css']
})
export class PortalUserNotificationComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  portalnotificationList: PortalNotificationsAndMsgs[] = [];
  notifications = new Array<PortalNotificationsAndMsgs>();
  uniqueID: string = new Date().getTime().toString();
  txtMessage: string = '';
  message = new PortalNotificationsAndMsgs();


  constructor(
    private _newSignalr: NewSignalrAlertService,
    public translate: TranslateService,
    private _poratlUserNotIfication: PortalUserNotificationService,
    private _ngZone: NgZone,
    private _toast: ToastrService,
  ) {
    this.subscribeToEvents();
  }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications() {
    this._poratlUserNotIfication.getportalNotification(0)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.portalnotificationList = res ? res.data : [];

      })
  }
  
  private subscribeToEvents(): void {
    let tempSender =JSON.parse(sessionStorage.getItem('currentUser'))

    this._newSignalr.privatePortalNotifications.subscribe((notification: PortalNotificationsAndMsgs) => {
      this._ngZone.run(() => {

        if (notification.clientuniqueid !== this.uniqueID) {
          notification.notifyType = 1;
          
          this._toast.info(notification.msgBody);
          this.notifications.push(notification);
          console.log(notification);
         

        }
      });
    });
  }

}

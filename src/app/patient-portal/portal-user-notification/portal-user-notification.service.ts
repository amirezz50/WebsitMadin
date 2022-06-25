import { Injectable } from '@angular/core';
import { HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
const portalNotificationUrl = CONFIG.baseUrls.portalNotification;



@Injectable({
  providedIn: 'root'
})
export class PortalUserNotificationService {

  constructor(private httpGeneralService: HttpGeneralService) { }
  getportalNotification(id: number) {
    return this.httpGeneralService.get(id, portalNotificationUrl);
  }
  
  // private connectionIsEstablished = false;
  // private _hubConnection: HubConnection;
  // connectionEstablished = new EventEmitter<Boolean>();
  
  // createConnection() {
  //   const user = this._authService.UserInfo;
  //   this._hubConnection = new HubConnectionBuilder()
  //     .withUrl(`${MessageHubUrl}?userID=${user.empID}`, {
  //       accessTokenFactory: () => {
  //         return createAuthorizationHeader().Authorization;
  //       }
  //     })
  //     .build();
  // }
  // generalMessage: EventEmitter<portalNotificationsAndMsgs> = new EventEmitter<portalNotificationsAndMsgs>()
  // generalMessageEvents(): void {
  //   this._hubConnection.on('GeneralMessage', (data: portalNotificationsAndMsgs) => {
  //     this.generalMessage.emit(data);
  //   });
  // }
  // privateMessage: EventEmitter<portalNotificationsAndMsgs> = new EventEmitter<portalNotificationsAndMsgs>();
  // privateMessageEvents(): void {
  //   this._hubConnection.on('sendNotify', (data: any) => {
  //     this.privateMessage.emit(data);
  //   });
  // }
}

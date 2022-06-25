import { Injectable, EventEmitter } from '@angular/core';
import { AuthService, HttpGeneralService } from './shared';

import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { createAuthorizationHeader } from './utility';
import { CONFIG } from './config';


export function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  var fileData = '';
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
          if (rawFile.status === 200 || rawFile.status == 0) {
              fileData = rawFile.responseText;
          }
      }
  }
  rawFile.send(null);
  return fileData;
}
// let MessageHubUrl = CONFIG.baseUrls.MessageHub;
let apiUrl = JSON.parse(readTextFile('../../setting/url.json')).apiUrl;
const MessageHubUrl = `${apiUrl}/MessageHub`;//'http://localhost:8888/MessageHub';
const ChatUrl = CONFIG.baseUrls.ChatData;

@Injectable()
export class NewSignalrAlertService {
  constructor(
    private _authService: AuthService,
    private _httpServ: HttpGeneralService
  ) {
    this.createConnection();
    this.activeUsersEvents();
    this.privateMessageEvents();
    this.generalMessageEvents();
    this.recievePortalNotificationsEvents();
    this.startConnection();
  }

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;
  connectionEstablished = new EventEmitter<Boolean>();


  createConnection() {
    let user = window.location.pathname.includes('portal/') ? JSON.parse(sessionStorage.getItem('currentPatient')) : JSON.parse(sessionStorage.getItem('currentUser'));
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${MessageHubUrl}?userID=${user.empID ? user.empID : user.code}`, {
        accessTokenFactory: () => {
          return createAuthorizationHeader().Authorization;
        }
      })
      .build();
  }

  sendMessage(message: Chat) {
    this._hubConnection.invoke('NewMessage', message);
  }

  sendPrivateMessage(msg: Chat) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this._hubConnection.invoke('SendPrivateMessage', currentUser.empID, msg.userId, msg);
  }
  /**
   * Get Private Message
   * Unique Active User
   */
  privateMessage: EventEmitter<Chat> = new EventEmitter<Chat>();
  privateMessageEvents(): void {
    this._hubConnection.on('PrivateMessage', (data: any) => {
      this.privateMessage.emit(data);
    });
  }
  getActiveUsers(): any {
    return this._hubConnection.invoke('GetAllActiveConnections');
  }

  startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000);
      });
  }




  /**
   * Get General Message
   * All Active Users
   */
  generalMessage: EventEmitter<Chat> = new EventEmitter<Chat>()
  generalMessageEvents(): void {
    this._hubConnection.on('GeneralMessage', (data: Chat) => {
      this.generalMessage.emit(data);
    });
  }

  /**
   * Get All Active Users
   */
  activeUsers: EventEmitter<string[]> = new EventEmitter<string[]>();
  activeUsersEvents(): void {
    this._hubConnection.on('ActiveUsers', (users: any) => {
      this.activeUsers.emit(users);
    });
  }

  getChatHistory(reciever: number) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return this._httpServ.post({ sender: currentUser.empID, reciever: reciever }, `${ChatUrl}/getChatHistory`);
  }
  getChatRecent() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    return this._httpServ.post({ sender: currentUser.empID }, `${ChatUrl}/getChatRecieversHistory`);
  }

  sendPrivateNotificationToPortal(notification: PortalNotificationsAndMsgs) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    notification.sender = currentUser.empID;
    this._hubConnection.invoke('SendPortalNotify', notification );
  }

  privatePortalNotifications: EventEmitter<PortalNotificationsAndMsgs> = new EventEmitter<PortalNotificationsAndMsgs>()
  recievePortalNotificationsEvents() {
    this._hubConnection.on('SendPortalNotify', (data: PortalNotificationsAndMsgs) => {
      this.privatePortalNotifications.emit(data);
    });
  }

}
export class Chat {
  clientuniqueid: string;
  type: string;
  message: string;
  date: Date;
  activeConnections: string[];
  userId: string;
  sender: string;
  senderName: string;
  senderShortName: string;
  reciever?: string;
  recieverName?: string;
  recieverShortName?: string;
}

export interface ActiveUsers {
  empId?: number;
  userName?: string;
  name?: string;
  shortName?: string;
  unreadMsg?: number;
  active?: number;
}


export class PortalNotificationsAndMsgs {
  serial: number;
  msgBody: string;
  notifyType: number;
  sender: number;
  reciver:string ;
  isReaded: number;
  isDisplayed: number;
  DisplayDate: Date;
  readDate: Date;
  clientuniqueid?: string;
}

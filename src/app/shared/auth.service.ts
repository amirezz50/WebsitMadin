
import { startWith, map, catchError, finalize } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { CONFIG } from './config';
import { MessageService } from './message.service';
import { ExceptionService } from '../blocks/exception.service';
import { SpinnerService } from '../blocks/spinner/spinner.service';
import { HttpGeneralService } from '.';

export interface UserData {
  userID: number;
  secLoginId: number;
  userName: string;
  defaultLang: number;
  admin: number;
  active: number;
  empID: number;
  defaultBranch: number;
  branchId: number;
  defaultGroup: number;
}

export interface AuditLog {
  Serial: number;
  SecLoginId: number;
  MachineName: string;
  DateTime: Date;
  TransType: number;
  ObjectName: string;
  BranchId: number;
  RegDate: Date;
  UpdateDate: Date

}

export interface LoginViewModel {
  userName: string;
  password: string;
}
@Injectable()
export class AuthService {
  authUrl: string;
  loggedIn = new Subject<boolean>();

  userLinksCollection: any[] = [];

  // event eniter for current user object changes
  currentUserEmit = new Subject<UserData>();
  private isLoggedIn = false;
  private userInfo: UserData = <UserData>{};

  public get UserInfo(): UserData {
    return this.userInfo;
  }

  constructor(
    private _http: HttpClient,
    private _exceptionService: ExceptionService,
    private _messageService: MessageService,
    private _spinnerService: SpinnerService
  ) {
    this.loggedIn.next(!!sessionStorage.getItem('currentUser'));
    this.fetchuserInfo();

    // this.getJSON().subscribe(data => {
    //   console.log(data)
    // });

    //`${CONFIG.Urls.apiUrlNew}/api/v1/FastSearch`
  }
  

  login(loginViewModel: LoginViewModel) {
    this.authUrl = CONFIG.baseUrls.auth.replace(
      CONFIG.Urls.apiUrlOld,
      CONFIG.Urls.apiUrlNew
    );
    let body = JSON.stringify(loginViewModel);
    // let body = loginViewModel;
    var headers = new HttpHeaders().set('Content-Type', 'application/json');
    this._spinnerService.show();
    return this._http
      .post(`${this.authUrl}/login`, body, { headers: headers }).pipe(
        map(res => {
          
          if (res['success']) {
            sessionStorage.setItem('currentUser', JSON.stringify(res['user']));
            
            this.userInfo = <UserData>res['user'];
            this.loggedIn.next(true);
          } else {
            sessionStorage.setItem('loginErrors', JSON.stringify(res));
           
          }
          return res['success'];
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }
  /***********-------------------------------------------------
   * used to change new sec login  and  branch 
   * @param secloginId
   */
  public SetNewLogin(_UserData: UserData  ) {
    let value = <UserData>JSON.parse(sessionStorage.getItem('currentUser'));
    value.secLoginId = _UserData.secLoginId;
    value.branchId = _UserData.branchId;
    value.defaultBranch = _UserData.defaultBranch;
    value.userName = _UserData.userName;
    sessionStorage.setItem('currentUser', JSON.stringify(value));
    this.currentUserEmit.next(value);
  }  

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
    return this._http
      .get(`${this.authUrl}/logout`).pipe(
        map((response: HttpResponse<any>) => response),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }

  isLogged(): boolean {
    this.isLoggedIn = !!sessionStorage.getItem('currentUser');
    this.loggedIn.next(this.isLoggedIn);
    return this.isLoggedIn;
  }
  checkIfLogged(): boolean {
    this.isLoggedIn = !!sessionStorage.getItem('currentUser');
    return this.isLoggedIn;
  }
  /************------------------------------------------------
   * return observable event emit in current user object changes
   */
  fetchuserInfo(): Observable<UserData> {
    let value = sessionStorage.getItem('currentUser');
    // if (value != "undefined") {
    this.currentUserEmit.next(<UserData>JSON.parse(value));
    return this.currentUserEmit
      .asObservable().pipe(
        startWith(<UserData>JSON.parse(value)));
    // }
  }

  /***********-------------------------------------------------
   * used to set new secloginid in current user in session storage
   * @param secloginId
   */
  public setNewSecLoginId(newId: any) {
    let value = <UserData>JSON.parse(sessionStorage.getItem('currentUser'));
    value.secLoginId = parseInt(newId);
    sessionStorage.setItem('currentUser', JSON.stringify(value));
    this.currentUserEmit.next(value);
  }
  /*************---------------------------------------------
   * return username
   */
  public getUserName() {
    let c = <UserData>JSON.parse(sessionStorage.getItem('currentUser'));
    return c != null ? c.userName : '';
  }
  /*************---------------------------------------------
   * return userId
   */
  public getUserId() {
    let c = <UserData>JSON.parse(sessionStorage.getItem('currentUser'));
    return c != null ? c.userID : '';
  }

  public userLinksCheck(url: string) {
    return this.userLinksCollection.find(link => {
      if (url.includes(link.routePath)) return url.includes(link.routePath);
    });
  }

  setUserLinks(userLinks: any[]) {
    this.userLinksCollection = userLinks;
  }

  //public getUserName() {
  //    return this.fetchuserInfo() != null ? this.fetchuserInfo().userName : "";
  //}

  public getJSON(): Observable<any> {
    return this._http.get("../../setting/display_login.json");
  }
  
}

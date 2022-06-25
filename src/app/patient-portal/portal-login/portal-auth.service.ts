import { Injectable } from '@angular/core';
import { LoginViewModel, HttpGeneralService } from '../../shared';
import { CONFIG } from '../../shared/config';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { map, catchError, finalize, startWith } from 'rxjs/operators';
import { ExceptionService, SpinnerService } from '../../blocks';
import { Observable, Subject } from 'rxjs';
import { TherapeuticCards } from '../portal-contracts';
import { Patient, PatientData, IPromotionsMsgLog } from './portal-login-interface';
import { Router } from '@angular/router';

const patientsUrl = CONFIG.baseUrls.patients;
let smsMessageUrl = CONFIG.baseUrls.SmsMessage;

@Injectable({
  providedIn: 'root'
})
export class PortalAuthService {
  authUrl: string;
  patientUrl: string;
  loggedIn: Subject<boolean> = new Subject<boolean>();

  // userLinksCollection: any[] = [];

  // event eniter for current user object changes
  currenPatientEmit = new Subject<Patient>();
  private isLoggedIn = false;
  private patientInfo: Patient = <Patient>{};

  public get PatientInfo(): Patient {
    return this.patientInfo;
  }

  constructor(
    private _http: HttpClient,
    private router: Router,
    private _httpGeneralService: HttpGeneralService,
    private _exceptionService: ExceptionService,
    private _spinnerService: SpinnerService
  ) {
    this.loggedIn.next(!!sessionStorage.getItem('currentPatient'));
    this.fetchPatientInfo();
  }

  login(loginViewModel: LoginViewModel) {
    this.authUrl = CONFIG.baseUrls.auth.replace(
      CONFIG.Urls.apiUrlOld,
      CONFIG.Urls.apiUrlNew
    );
    let body = JSON.stringify(loginViewModel);
    var headers = new HttpHeaders().set('Content-Type', 'application/json');
    this._spinnerService.show();
    return this._http
      .post(`${this.authUrl}/PortalLogin`, body, { headers: headers }).pipe(
        map(res => {
          if (res['success']) {
            sessionStorage.setItem('currentPatient', JSON.stringify(res['patient']));
            this.patientInfo = <Patient>res['patient'];
            this.loggedIn.next(true);
          } else {
            sessionStorage.setItem('loginErrors', JSON.stringify(res));

          }
          return res['success'];
        }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }


  /************------------------------------------------------
   * return observable event emit in current user object changes
   */
  fetchPatientInfo(): Observable<Patient> {
    let value = sessionStorage.getItem('currentPatient');
    // if (value != "undefined") {
    this.currenPatientEmit.next(<Patient>JSON.parse(value));
    return this.currenPatientEmit
      .asObservable().pipe(
        startWith(<Patient>JSON.parse(value)));
    // }
  }

  logout() {
    sessionStorage.clear();
    this.loggedIn.next(false);
    return this._http
      .get(`${this.authUrl}/PortalLogout`).pipe(
        map((response: HttpResponse<any>) => response),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()));
  }

  isLogged(): boolean {
    this.isLoggedIn = !!sessionStorage.getItem('currentPatient');
    this.loggedIn.next(this.isLoggedIn);
    return this.isLoggedIn;
  }
  checkIfLogged(): boolean {
    this.isLoggedIn = !!sessionStorage.getItem('currentPatient');
    return this.isLoggedIn;
  }

  // Reset Password
  resetPassword(patient: Patient) {
    return this._httpGeneralService.update(patient.code, patient, `${patientsUrl}/changePassword`)
  }
  // update Userdata
  updateUserData(patient: Patient) {
    return this._httpGeneralService.update(patient.code, patient, `${patientsUrl}/ChangeUserData`)
  }


  // clear and reload
  clearCache() {
    let visit = sessionStorage.getItem('CURRENT_VISIT_' + this.getPatientCode);
    localStorage.clear();
    sessionStorage.clear();
    if (visit)
      sessionStorage.setItem('CURRENT_VISIT_' + this.getPatientCode, visit);

    this.router.navigate(['/portal/login']);
    //window.location.reload();
  }
  /*************---------------------------------------------
   * return username
   */
  public getUserName() {
    let c = <Patient>JSON.parse(sessionStorage.getItem('currentPatient'));
    return c != null ? c.userName : '';
  }
  /*************---------------------------------------------
   * return patCode
   */
  public get getPatientCode(): number {
    let c = <Patient>JSON.parse(sessionStorage.getItem('currentPatient'));
    return c != null ? c.code : 0;
  }


  public get getCashedPatientData(): Patient {
    let pat = <Patient>JSON.parse(sessionStorage.getItem('currentPatient'));
    return pat ? pat : <Patient>{};
  }

  public get getSessionPatient(): Patient {
    let pat = <Patient>JSON.parse(sessionStorage.getItem('CURRENT_PATIENT'));
    return pat ? pat : <Patient>{};
  }

  public get getPatientContract(): TherapeuticCards {
    let con = <TherapeuticCards>JSON.parse(sessionStorage.getItem('PATIENT_CONTRACT'));
    return con ? con : <TherapeuticCards>{};
  }


  //////////
  getPatient(id: string) {
    return this._httpGeneralService.getWith(`${patientsUrl}/${id}`);
  }

  searchPatients(searchObj: Patient) {
    return this._httpGeneralService.add(searchObj, `${patientsUrl}/searchSp`);
  }
  ///
  getCheckedPassword(code: string) {
    return this._httpGeneralService.getWith(`${patientsUrl}/${code}`);
  }


  // Register Part
  registerNewPatient(entity: PatientData) {
    return this._httpGeneralService.add(entity, `${patientsUrl}/registerAccount`);
  }

  sendActivationCode(entity: Patient) {
    return this._httpGeneralService.add(entity, `${patientsUrl}/sendActivationCode`);
  }

  sendActivationCodeSms(mobile, message) {
    this.RemindingBookingMsg(mobile, message).subscribe(u => { var res = u });
  }
  RemindingBookingMsg(mobile, message) {
    let data: IPromotionsMsgLog = {}
    data.mobile = mobile
    data.message = message
    return this._httpGeneralService.add<IPromotionsMsgLog[]>([data], `${smsMessageUrl}/RemindingBookingMsg`);
  }
  sendEgyMessage(mobile, message) {
    let body = '';
    let authUrl = `https://smsmisr.com/api/webapi/?username=F7bpeVQf&password=uqURwTZ6e8&language=2&sender=BIT News&mobile=${mobile}&message=${message}&DelayUntil=2017-09-13-13-30`
    return this._http.post(authUrl, body).pipe(map(res => { return res }));
  }

  checkRecoveryAccount(checkObj: {}) {
    this.patientUrl = CONFIG.baseUrls.patients.replace(
      CONFIG.Urls.apiUrlOld,
      CONFIG.Urls.apiUrlNew
    );
    let body = JSON.stringify(checkObj);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    this._spinnerService.show();
    return this._http
      .post(`${this.patientUrl}/checkRecoveryAccount`, body, { headers: headers }).pipe(
        map(res => { if (res) return res; }),
        catchError(this._exceptionService.catchBadResponse),
        finalize(() => this._spinnerService.hide()))
      .toPromise();
  }
}


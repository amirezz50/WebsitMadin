import { Component, Inject, OnInit } from '@angular/core';
import { PortalAuthService } from './portal-login/portal-auth.service';
import { DOCUMENT, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSessionService } from '../shared';
import { TranslateService } from '@ngx-translate/core';
import { Patient } from './portal-login/portal-login-interface';
import { readTextFile } from '../shared/new-signalr-alert.service';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.css']
})
export class PatientPortalComponent implements OnInit {
  currentPatient: Patient = <Patient>{};
  isLoggedIn: boolean = false;
  langDesc: string = 'العربية';
  websiteUrl :any
  constructor(
    public _authService: PortalAuthService,
    private _router: Router,
    public translate: TranslateService,
    private _userSessionService: UserSessionService,
    @Inject(DOCUMENT) private document


  ) {
    translate.addLangs(['ar', 'en']);
    translate.use('ar');
     this.websiteUrl = JSON.parse(readTextFile('../../setting/url.json')).websiteUrl;

  }
  ngOnInit() {
    this._userSessionService.setSessionKey('patient', { ...this._authService.getSessionPatient });
    this.isLoggedIn = this._authService.isLogged();
    if (this.isLoggedIn) {
      this.currentPatient = this._authService.getCashedPatientData;
      this._router.navigateByUrl('/portal/home');
    } else {
      this._router.navigateByUrl('/portal/login');
    }
  }

  logout() {
    this._authService.clearCache();
    this.logToggel = false;
  }
  language: boolean = false;
  langShow() {
    this.language = !this.language;
  }
  LangChange(ev) {
    if (ev && ev == '1') {
      this.langDesc = 'العربية';
      this.translate.use('ar');
      this.document
        .getElementById('ltrCssFile')
        .setAttribute('href', 'assets/css/rtl.css');
    }
    if (ev && ev == '2') {
      this.langDesc = 'English';
      this.translate.use('en');
      this.document
        .getElementById('ltrCssFile')
        .setAttribute('href', 'assets/css/ltr.css');
    }
  }

  logToggel: boolean = false;
  openDialog() {
    this.logToggel = true;
  }
  cancelDialog() {
    this.logToggel = false;
  }

}

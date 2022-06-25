
import { takeUntil, map, take, debounceTime, switchMap } from 'rxjs/operators';
import { SpinnerService } from './blocks/spinner/spinner.service';
import {
  Component,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild
} from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
// tslint:disable-next-line:import-blacklist
import { Subscription, Subject, Observable, timer } from 'rxjs';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService, UserData } from './shared';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import {
  ModalService,
  ToastService,
  ControlsComponent,
  StorageService
} from './blocks';
import { UserSessionService } from './app-user-session.service';
import { LoaderService } from './ng2-loader/ng2-loader';
import {
  Location,
  DOCUMENT
} from '@angular/common';

import { CONFIG } from './shared/config';
import {
  NotifySignalrService,
  NotifyMesseage,
  NotifyVM
} from './shared/notify-signalr.service';

import { DropdownDirective } from './dropdown.directive';
import { createAuthorizationHeader, validateAuthorizationHeader, getUrlParameter, setUserToSessionFromLocalStorage } from './shared/utility';
import { Module } from './modules/module';
import { FormControl } from '@angular/forms';

declare var $: any;
let usersSecLoginsUrl = CONFIG.baseUrls.usersGroups;
const appComonent = CONFIG.baseUrls.modules;
const auth = CONFIG.baseUrls.auth;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(window:scroll)': 'onScroll($event)',
    // ,'(document:keyup)': 'hotkeys($event)'


    '(document:click)': 'onClickOutside($event)',

  },
  //directives: [DropdownDirective]

})
export class AppComponent implements OnInit, OnDestroy {
  public editorValue: string = '';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  authUrl: string;
  isLoading = false;
  secLoginPrivileges: any;
  forDebugXHR = false;
  userLoggedSubscribtion: Subscription;
  userLogged = false;
  callCenterLogin = false;
  currentuser: string;
  currentLangFlag: string;
  seclog: any[];
  headerParms: any;
  serviceObject: any;
  _obj: HTMLDivElement = <HTMLDivElement>{};
  searchInputSubscribe: Subscription;

  currentLink: any;
  appdropdowns: any;
  location: Location;
  showScroll = false;
  private _opened = false;
  menuHidden = true;
  countsHidden = true;
  userSecLogin: number;
  currentUserId: number;
  showDropdown: boolean = false;
  notArr = [];
  reqListPer: number = undefined;
  notMangerArr = [];
  @ViewChild('ddm', { static: false }) alertList: ElementRef;
  //
  @ViewChild('inputElement', { static: true }) private inputElement: ElementRef;
  @ViewChild('popup1', { static: false }) popup1: any;


  notifications: NotifyVM[] = [];

  // abood start
  hideSearchBar = false;
  dispalySetting: any;
  displayFlag: any;
  notifySerial: number = 0;
  showAlertList: boolean = false
  offsetHeight: number;
  offsetWidth: number;
  clientX: number;
  clientY: number;
  searchInputControl = new FormControl();
  favoLinksCopy: any[] = [];
  showFavArea = false;
  private unSubscriber = new Subject();
  userLoginEmpId: number;

  hideSearch() {
    this.hideSearchBar = !this.hideSearchBar;
  }

  language: boolean = false;
  langShow() {
    this.language = !this.language;
  }


  constructor(
    location: Location,
    private _http: HttpClient,
    public translate: TranslateService,
    private _router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private _toastService: ToastService,
    private _modalService: ModalService,
    private _authService: AuthService,
    private _userSessionService: UserSessionService,
    private _loaderService: LoaderService,
    private spinnerService: SpinnerService,
    private signalrService: NotifySignalrService,
    private _SS: StorageService,
    private eRef: ElementRef,
    private _NotifySignalrService: NotifySignalrService,
    private _eref: ElementRef,
    @Inject(DOCUMENT) private document
  ) {

    this.location = location;
    this.headerParms = {};
    this.appdropdowns = {};
    translate.addLangs(['ar', 'en']);
    translate.use('ar');


    this.signalrService.notifications$.subscribe(value => {

      if (value) {
        this.notifications.push(value);
      }
    });

  }
  //------------------------click any where to hide notification list ASSMAA----------

  onClickOutside(ev) {
    if (ev.clientX != this.clientX && ev.clientY != this.clientY) {
      this.showAlertList = false
    }
  }
  //------------------------------------------------------------------------------
  setDisplayForddm(ddm: HTMLDivElement, ev) {
    this.showAlertList = !this.showAlertList
    this.clientX = ev.clientX
    this.clientY = ev.clientY

  }

  //hr request
  sowreqClicked(hr: HTMLDivElement) {
    if (hr.classList.contains('drop_down_menu_block')) {
      hr.classList.remove('drop_down_menu_block');
      hr.classList.add('drop_down_menu_none');
    } else if (hr.classList.contains('drop_down_menu_none')) {
      hr.classList.remove('drop_down_menu_none');
      hr.classList.add('drop_down_menu_block');
    }
  }

  LangChange(ev) {
    if (ev && ev == '1') {
      this.RTL();
    }
    if (ev && ev == '2') {
      this.LTR();
    }
  }
  clearLocalStorage(showMessage: boolean) {
    this._SS.clear();
    if (showMessage)
      this._toastService.activateMsg('Browser cache cleared successfully ');
  }
  LTR() {
    this.translate.use('en');
    this.currentLangFlag = 'En';
    this.document
      .getElementById('ltrCssFile')
      .setAttribute('href', 'assets/css/ltr.css');
  }
  /**
   * load css file for Arabic lang
   */
  RTL() {
    this.translate.use('ar');
    this.currentLangFlag = 'ع';
    this.document
      .getElementById('ltrCssFile')
      .setAttribute('href', 'assets/css/rtl.css');
  }
  favoLinks: any[] = [];


  toggleFavArea() {
    this._userSessionService.subscribeToKey$('toggleFavArea')
      .subscribe((keys: any) => {
        if (keys && keys.value) {
          this.favoLinks = keys.value;
          this.favoLinksCopy = Object.assign([], this.favoLinks);
          this.showFavArea = !this.showFavArea;
          this.inputElement.nativeElement.focus();
          this.inputElement.nativeElement.select();
        }
      })
  }

  // onLinkClicked(link: Module, event: Event) {
  //   this.dashboardComponent.onLinkClicked(link, event);
  // }


  //////////////
  // set new sec logins
  child_id: number;
  // userSelectizeClicked(event) {
  //   if (event && event.active == 0 && event.active != null) {
  //     this._toastService.activateMsg('UI48');
  //   }
  //   this.authUrl = CONFIG.baseUrls.auth.replace(
  //     CONFIG.Urls.apiUrlOld,
  //     CONFIG.Urls.apiUrlNew
  //   );
  //   if (event && event.code) {
  //     this.userSecLogin = event.code;
  //   }
  //   if (event && event != null && event['AutoEmited'] == false) {

  //     if (event.code > 0) {

  //       this.child_id = event.code;
  //       this._authService.SetNewLogin(event);
  //     } else {
  //       let x = JSON.parse(sessionStorage.getItem('currentUser'));
  //       this.child_id = x.secLoginId;
  //     }
  //     // this.appdropdowns['dropdown-user'] = false;
  //     let headers = createAuthorizationHeader();
  //     return this._http
  //       .get(`${this.authUrl}/reSetSecLogins/${this.userSecLogin}`, { headers: headers }).pipe(
  //         map((res: HttpResponse<any>) => res))
  //       .subscribe(res => {

  //         if (res['data']) {
  //           this.dashboardComponent.moduleLinks = res['data'];
  //           this.appdropdowns['dropdown-user'] = false;

  //         }

  //       });

  //   }

  // // }
  // searchLink(_event: Event) {
  //   const data = _event.target['value'];
  //   this.dashboardComponent.moduleLinks.forEach(item => {
  //     if (
  //       item['nameAr'].toString().indexOf(data) > -1 ||
  //       item['nameEn']
  //         .toString()
  //         .toLowerCase()
  //         .indexOf(data) > -1
  //     ) {
  //       item['hidden'] = false;
  //     } else {
  //       item['hidden'] = true;
  //     }
  //   });
  // }
  searchOnfavList(value: string) {
    let exp = /^[A-Za-z][A-Za-z0-9_ ]*$/;
    if (value && value.length > 0) {
      this.favoLinks = [];
      if (exp.test(value) || value == '') {

        this.favoLinks = this.favoLinksCopy.filter(s => s['nameEn'].includes(value));
      }
      else {
        if (isNaN(+value)) {
          this.favoLinks = this.favoLinksCopy.filter(s => s['nameAr'].includes(value));
        } else {
          this.favoLinks = this.favoLinksCopy.filter(s => s['sortView'] == +value);
        }
      }
    }
    if (value.length == 0) {
      this.favoLinks = this.favoLinksCopy;
    }
  }


  //createObservableSearch

  creatpsearch() {
    this.searchInputControl.valueChanges.subscribe(x => {
      debounceTime(100);
      this.searchOnfavList(x);


    })
  }



  // favSearchOnkeyEnter(value: any) {

  //   let valueAsNumber = +value;
  //   if (!isNaN(valueAsNumber) && valueAsNumber > 0) {
  //     let indx = this.favoLinksCopy.findIndex((el, index) => el.sortView == valueAsNumber);
  //     if (indx != -1) {
  //       let linkObject = this.favoLinksCopy[indx];
  //       if (linkObject && Object.keys(linkObject)) {
  //         this.onLinkClicked(linkObject, null);
  //         this.showFavArea = !this.showFavArea;
  //       }

  //     }

  //   }
  // }
  /////////
  onMasterActionIcon(id: any) {
    if (this.menuHidden != true) {
      this.toggleDashboard();
    }
    this._router.navigate(['/secfavouritesettiong']);
  }

  ngOnInit() {

    this.readRouteParms();
    this.creatpsearch();

    // this._router.navigate(['/seclogin']);

    // start i.hamed custom code
    this._authService.getJSON().subscribe(data => {
      this.dispalySetting = data.DisplaySetting;
      this.displayFlag = this.dispalySetting.DisplayFlag;
      if (this.displayFlag == 1) {
        // this.document.body.classList.add('body-hospital');
      }
      else if (this.displayFlag == 2) {
        // this.document.body.classList.add('body-erp');
      }
      else if (this.displayFlag == 3) {
        // this.document.body.classList.add('body-hr');
      }
      else if (this.displayFlag == 4) {
        // this.document.body.classList.add('body-clinic');
      }
      else {
        // this.document.body.classList.add('body-hospital');
      }
    });


    this._userSessionService.subscribeToKey$('link')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((keys) => {
        if (keys.value) {
          let link = keys.value;
          let docMode = +link.mode;
          if (link.code == 10512) {
            this.translate.use('en');
            this.translate.currentLang = 'en';
            this.translate.defaultLang = 'en';
            this.document.getElementById('ltrCssFile').setAttribute('href', 'assets/css/ltr.css');
            this.LTR();
            // console.log('you are in doctor mode!');
          } else if (link.code == 5407 && docMode == 2) {
            // console.log('you are in nurse mode!');
          }
        }
      })

    // end i.hamed custom code
    this._SS.removeItem('FastSearchCached');
    this.currentLink = {};
    this._loaderService.getSettings('url', 'setting').subscribe(
      v => {
        let apiUrl = v['apiUrl'];
        let reportUrl = v['reportUrl'];

        const dashboardurl = v['dashboardurl']
        const versionCode = v['version'];
        const api_and_ui_is_the_same_url = v['api_and_ui_is_the_same_url'];
        const staticUrl = v['staticUrl'];


        if (api_and_ui_is_the_same_url == '1') {
          if (window.location.href.startsWith('https://')) {
            apiUrl = window.location.href.substring(8).split('/')[0];
            apiUrl = 'https://' + apiUrl;


          }
          else if (window.location.href.startsWith('http://')) {
            apiUrl = window.location.href.substring(7).split('/')[0];
            if (v[apiUrl]) {
              reportUrl = v[apiUrl]['reportUrl'];
            }

            apiUrl = 'http://' + apiUrl;
            // if(staticUrl != undefined &&  staticUrl != ''){
            // }


          } else {
            apiUrl = window.location.href.split('/')[0];
          }

        }
        else if (api_and_ui_is_the_same_url == '2') {
          if (staticUrl && staticUrl != "" && window.location.href.includes(staticUrl)) {
            apiUrl = ""
          } else {

          }


        }




        // console.log('this is version: ' + versionCode);
        let oldversionNo = localStorage.getItem('version');
        if (oldversionNo == (undefined || null) || oldversionNo != versionCode) {
          this.clearLocalStorage(false);
          localStorage.setItem('version', versionCode);
        }
        CONFIG.Urls.apiUrlNew = apiUrl;
        CONFIG.Urls.reportUrl = reportUrl;
        CONFIG.Urls.dashboardurl = dashboardurl
        usersSecLoginsUrl = CONFIG.updateOldUrl(usersSecLoginsUrl);

        this._authService.loggedIn.subscribe(p => {

          this.userLogged = p;
          if (this.callCenterLogin)
            this.userLogged = true;


          if (this.userLogged) {
            this.currentUserId = +this._authService.getUserId();
            this.menuHidden = false;
          } else {
            this.userLogged = true;
            this._userSessionService.subscribeToKey$('ROUTEPATH')
              .subscribe(res => {
                if (res.value) {
                  this._router.navigateByUrl(res.value);
                  this.ddClick('dropdown-request');
                  if (this.menuHidden != true) {
                    this.toggleDashboard();
                  }
                } else {
                  if (window.location.pathname.includes('portal')) {
                    this._router.navigateByUrl('/portal/login');
                  } else {
                    this._router.navigateByUrl('/login');
                  }
                }
              });
          }
        });
        if (!this.callCenterLogin) {
          if (this.userLogged == false) {
            if (window.location.pathname.includes('portal')) {
              this._router.navigateByUrl('/portal/login');
            } else {
              this._router.navigateByUrl('/login');
            }
          }
        }
        this.currentuser = this._authService.getUserName();

        // used to load css file for lang
        if (this.translate.currentLang == 'ar') {
          this.RTL();
        } else if (this.translate.currentLang == 'en') {
          this.LTR();
        }
      },
      error => console.log(error)
    );
    this.DashBoardParms$();
    this.CurrentLink$();
    this.loginPrivilege$();
    this.spinnerService.spinnerState.subscribe(res => {

      setTimeout(() => (this.isLoading = res.show), 0);
    });


    // -------------------------start reset notifaication-- ASSMAA-- ----------------

    this._userSessionService.subscribeToKey$('resetNotificationList').pipe(takeUntil(this.unSubscriber))
      .subscribe(res => {

        if (res.value) {
          let obj = this.notifications.find(e => e.serial == res.value.serial)
          if (obj) {
            let index = this.notifications.indexOf(obj);
            this.notifications.splice(index, 1);
            // console.log(this.notifications)
          }
        }
      })
    //------------------------------------------------------------------------------------

  }


  readRouteParms() {

    if (window.location.href.includes('callcenter') || window.location.href.includes('journals/manual')) {

      sessionStorage.setItem('currentUser', localStorage.getItem('currentUser'));
      let x = sessionStorage.getItem('currentUser');
      if (x && typeof JSON.parse(x) == "object") {
        this.callCenterLogin = true;
        this.currentUserId = +this._authService.getUserId();
        this.currentuser = this._authService.getUserName();
      }
      //this._router.navigateByUrl('/callcenter/new?')
      //console.log('__________call center reservation______')
    } else {


      let commingOuth = getUrlParameter('tempOuth') || '';
      let timeStamp = +getUrlParameter('st') || 0;
      let curentTime = Date.now();
      if (curentTime && timeStamp && ((curentTime - timeStamp) / 60000) < 5) {
        if (commingOuth && commingOuth != '') {
          if (validateAuthorizationHeader(commingOuth)) {
            this.userLogged = true;
            setUserToSessionFromLocalStorage();

          }

        };
      }
    }


  }
  toggleDashboard() {
    const obj = this._userSessionService.getAllModalKeys();

    // if (this._router.url == '/login') {
    //   return;
    // }
    this.menuHidden = !this.menuHidden;
    if (!this.menuHidden) {
      this.countsHidden = true;
    }
  }

  toggleCountsDashboard() {
    this.countsHidden = !this.countsHidden;
    if (!this.countsHidden) {
      this.menuHidden = false;
    }
  }
  hideDashboard() {
    this.menuHidden = true;
  }
  ngOnDestroy() {
    this.userLoggedSubscribtion.unsubscribe();
  }
  logout() {
    location.reload();

  }
  // -----------click of  dropdown
  ddClick(ddname: string) {
    if (this.appdropdowns[ddname] != undefined) {
      this.appdropdowns[ddname] = !this.appdropdowns[ddname];
    } else {
      this.appdropdowns[ddname] = true;
    }
  }
  // scroll HostListener
  @HostListener('scroll', ['$event'])
  appOnScroll() {
    this.onScroll();
  }

  // show or hide scroll button
  onScroll() {
    if (window.pageYOffset > 100) {
      this.showScroll = true;
    } else {
      this.showScroll = false;
    }
  }
  // return to previous page
  previousPage() {
    this.location.back();
  }
  // go to the top of page
  scrollToTop() {
    window.scrollTo(0, 0);
  }
  // subscription ForDebugPrivilege
  DashBoardParms$() {
    this._userSessionService
      .subscribeToKey$('DashBoardParms')
      .subscribe((keys: any) => {
        if (keys.name == 'DashBoardParms' && keys.value) {
          this.headerParms['branchNameEn'] = keys.value['branchNameEn'];
          this.headerParms['branchNameAr'] = keys.value['branchNameAr'];
          this.headerParms['userName'] = keys.value['userName'];
          this.headerParms['dbName'] = keys.value['dbName'];
          this.headerParms['base64'] = keys.value['base64'];
        }
      });
  }
  // subscription ForDebugPrivilege
  loginPrivilege$() {
    this._userSessionService
      .subscribeToKey$('SecLoginPrivileges')
      .subscribe((keys: any) => {
        if (keys.name == 'SecLoginPrivileges' && keys.value) {
          this.secLoginPrivileges = keys.value[0];
        }
      });
  }
  forDebug() {
    this.forDebugXHR = !this.forDebugXHR;
    sessionStorage.setItem(
      'forDebug',
      String(this.forDebugXHR == true ? 1 : 0)
    );
  }
  CurrentLink$() {
    this._userSessionService.subscribeToKey$('link').subscribe((keys: any) => {
      if (keys.value) {
        this.currentLink = keys.value;
        if (this.translate.currentLang == 'ar') {
          document.title = this.currentLink.nameAr
            ? this.currentLink.nameAr
            : 'Bee';
        } else if (this.translate.currentLang == 'en') {
          document.title = this.currentLink.nameEn
            ? this.currentLink.nameEn
            : 'Bee';
        }
      }
    });
  }

  @HostListener('document:keyup', ['$event'])
  hotkeys(event: any) {
    switch (event.keyCode) {
      case 83:
        if (!event.ctrlKey) {

        }
        break;
      case 120:
        this.toggleFavArea();
        break;
      case 118:
        break;
      case 119:
        event.preventDefault();
        const btnsViewChild = <ControlsComponent>(
          this._userSessionService.getBtnCtrl()
        );
        if (btnsViewChild) {
          btnsViewChild.emitClicked(event.keyCode);
        }
        break;
      default:
        break;
    }

  }
  goToAllAlert() {
    this._userSessionService.setSessionKey('aletHistory', null)
    this._router.navigate(['/personnelSetup/alert-history']);
    this.ddClick('dropdown-request');
    if (this.menuHidden != true) {
      this.toggleDashboard();
    }
  }

  OnNotifiClick(type) {

    // if (type && type.serial) {
    //   this.notifySerial = type.serial
    //   type.isReaded = 1
    //   this._userSessionService.setSessionKey('aletHistory', type)
    //   this._router.navigate(['/personnelSetup/alert-history']);
    //   if (this.menuHidden != true) {
    //     this.toggleDashboard();
    //   }
    // }
    // if (type && type.bodyNM.type == 'vacationRequest') {
    //   this._userSessionService.setSessionKey('vacationRequestserial', type.bodyNM.actionSerial)
    //   this._router.navigate(['/personnelSetup/requests-managment']);
    //   this.ddClick('dropdown-request');
    //   if (this.menuHidden != true) {
    //     this.toggleDashboard();
    //   }
    // }

    // if (type && type.bodyNM.type == 'itemExpire') {

    //   this._userSessionService.setSessionKey('itemExpire',type.bodyNM.actionSerial)
    //   this._router.navigate(['/stock/expire/items']);
    //   this.ddClick('dropdown-request');
    //   if (this.menuHidden != true) {
    //     this.toggleDashboard();
    //   }
    // }



  }


  reqClicked(code) {
    if (code) {
      //___get User Login EmpId from 'secUserMainData' session in Login Componnet __
      this._userSessionService.subscribeToKey$('secUserMainData').pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((keys: any) => {
          if (keys.value) {
            this.userLoginEmpId = keys.value.empID;
            this._userSessionService.setSessionKey('userLoginEmpId', this.userLoginEmpId);
          }
        });
      //____________________empVacReq by employee himSelf___
      if (code == 1) {
        this._userSessionService.setSessionKey('DashOrMasterVac', 1);
        this._router.navigate([
          '/attendance/vacation-request/new',
          { mode: undefined }
        ]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //___________________ Permission Request By employee ________________
      if (code == 2) {
        this._router.navigate(['/attendance/permissionRequest/new']);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //__________________________________________________________________
      if (code == 3) {
        this._router.navigate(['/personnelSetup/hrLoanRequest/new']);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //__________________________________________________________________
      if (code == 4) {
        this._router.navigate(['/ph/stock/stockpermission',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //___________________________________________________________________
      if (code == 5) {
        this._router.navigate(['/personnelSetup/employeeSalaryPath',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //___________________________________________________________________
      if (code == 6) {
        this._router.navigate(['/personnelSetup/hrCoverLetter',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
      //___________________________________________________________________
      if (code == 7) {
        this._router.navigate(['/appraisal/hrApprisalRequest',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      } 
      if (code == 8) {
        this._router.navigate(['/appraisal/hrEmpVisaRequest',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }

      if (code == 9) {
        this._router.navigate(['/training/trainbook/new',
          { mode: undefined }]);
        this.ddClick('dropdown-request');
        if (this.menuHidden != true) {
          this.toggleDashboard();
        }
      }
    }
  }
  //-----------click of  dropnoTificationdown
  noTification(noTification: string) {
    if (this.appdropdowns[noTification] != undefined) {
      this.appdropdowns[noTification] = !this.appdropdowns[noTification];
    } else {
      this.appdropdowns[noTification] = true;
    }
  }

  // Beginning Change Password Props
  @ViewChild('popup', { static: false }) content: any;
  DynamicComponent: any;
  DynamicComponent1: any;
  // End Of Props

  // Change Password Popup Functions
  changePasswordPopup(userId: any) {
    this.appdropdowns['dropdown-user'] = false;
    // define object and in case of add set id null and userId data
    let masterParms = {}
    if (userId == null) {
      masterParms = { userID: this.currentUserId }
    }
    // console.log(this.currentUserId);
    // console.log(this.currentuser);
    // console.log(this.headerParms['userName'] + this.headerParms['dbName']);
    //send data when model open
    // this.DynamicComponent = ChangePasswordComponent;
    this.content.openModal("ChangePasswordComponent", "masterParms", masterParms, 'lg');
  }

  onpopupClose(parms: any) {
    // get data after model (Popup) close..
    if (parms && parms.output == 'Cross click') {
      //this.ngOnInit();
    }
  }
  // onFavourite(module: any, datastatus: number) {
  //   this.dashboardComponent.onFavourite(module, datastatus)
  // }


  getModalEmail() {
    // this.DynamicComponent1 = MailsBoxComponent;
    // this.popup1.openModal("MailsBoxComponent", "masterParms", {}, 'lg');

    // this.DynamicComponent1 = MailsListBoxComponent;
    // this.popup1.openModal("MailsListBoxComponent", "masterParms", {}, 'lg');

    if (this.menuHidden != true) {

      this.toggleDashboard();
    }

  }
  goToChat() {
    // this.DynamicComponent1 = ChatComponent;
    this.popup1.openModal("ChatComponent", "masterParms", {}, 'lg');



  }
}

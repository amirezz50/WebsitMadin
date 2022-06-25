import { filter } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { ModalService } from './blocks/modal/modal.service';
import { Observable, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { Utility } from "./shared/utility";


interface generalObject {
  name: string;
  value: any;
  keys: any;
  from?: any;
  to?: any;
}

interface subjectkeyval {
  subkey: string;
  subjectObj?: Subject<any>;
  behaviorSubjectObj?: BehaviorSubject<any>;
}

export interface Action {
  type: string;
  payload?: any;
}
export const UIAction = {
  TabActived: 'Tap Actived',
  TabVisited: 'Tap Visited',
  AddTrans: 'Add Trans',
  AddAndStepTrans: 'Add And Step Trans',
  CommitTrans: 'Commit Trans',
  RollbackTrans: 'Rollback Trans',
  TransStepped: 'Trans Stepped',
  OpenNewLink: 'Open New Link',

  GetTransData: 'Get Transaction data',

}
export const UISessionKeys = {
  Transactions: 'Transactions',
  ActivatedAppCodes: 'ActivatedApplicationCodes'

}
export const NoChangeReducer = (state = [], action) => {
  return state;
}
@Injectable()
export class UserSessionService {

  public secLoginId: number;
  public regPatCode: number;
  private userSessionKeys: any = {};
  // private userSessionKeys$ = new Subject<any>();
  private subjectsarr: subjectkeyval[];

  private modalKeys: any = {};
  private modalKeys$ = new Subject<any>();
  private modalClose$ = new Subject<any>();
  private btnCtrlViewChild: any = {};
  private UIState: any = {};
  private dispatcher: any;
  displayFlag: number;
  styleFlag: number;
  globalmodulesSettings: any = {};
  constructor(private _modalService: ModalService) {
    this.subjectsarr = [];
    this.dispatcher = NoChangeReducer;
  }

  subscribeToKeys$() {
    return of(this.userSessionKeys);
  }
  /***********************************************************************************************
  * used to add key to user session object 
  * @param key
  * @param value
  */
  setSessionKey(key: string, value: any, propagateChanges?: boolean) {
    if (propagateChanges == undefined) propagateChanges = true;
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined) {
      this.subjectsarr.push({ subkey: key, subjectObj: new Subject<any>(), behaviorSubjectObj: new BehaviorSubject<any>({}) });
    }

    this.userSessionKeys[key] = { name: key, value: value, keys: {}, propagateChanges: propagateChanges } as generalObject;
    if (propagateChanges) {
      let dd$ = (this.subjectsarr.find(a => a.subkey == key));
      if (dd$.subjectObj) dd$.subjectObj.next(this.userSessionKeys[key]);
      if (dd$.behaviorSubjectObj) dd$.behaviorSubjectObj.next(this.userSessionKeys[key]);
    }
  }
  eventEmit(key: string, value: any) {
    this.setSessionKey(key, value, true);
    delete this.userSessionKeys[key];
  }
  /***********************************************************************************************
  * used to update key property to user session object 
  * @param key
  * @param property
  * @param value
  */
  updateSessionKey(key: string, updateObject: any, propagateChanges?: boolean) {
    if (propagateChanges == undefined) propagateChanges = true;
    if (this.userSessionKeys[key]) {
      this.userSessionKeys[key].value = Object.assign({}, this.userSessionKeys[key].value, updateObject);
    }
    if (propagateChanges) {
      let dd$ = (this.subjectsarr.find(a => a.subkey == key));
      if (dd$ && dd$.behaviorSubjectObj)
        dd$.behaviorSubjectObj.next(this.userSessionKeys[key]);
    }
  }


  /***********************************************************************************************
  * return observable for user session object  
  * @param key
  */
  getSessionKey$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$) {
      return dd$.subjectObj.asObservable();
    } else {
      dd$ = { subkey: key, subjectObj: new Subject<any>() }
      this.subjectsarr.push(dd$);
      return dd$.subjectObj.asObservable();
    }

  }
  subscribeToKey$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$ && dd$.behaviorSubjectObj) {
      return dd$.behaviorSubjectObj.asObservable();
    } else {
      if (dd$ && dd$.behaviorSubjectObj == undefined) {
        dd$['behaviorSubjectObj'] = new BehaviorSubject<any>({});
      } else {
        dd$ = { subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}), subjectObj: new Subject<any>() }
        this.subjectsarr.push(dd$);
      }
      return dd$.behaviorSubjectObj.asObservable();
    }
  }
  /***********************************************************************************************
  * return key from user session object generic type
  * @param key
  */
  getSessionKey<T>(key: string): T {

    const temp = key.split('.');
    let elem = null;
    if (temp.length > 1) {
      if (this.userSessionKeys[temp[0]]) {
        const temp0 = this.userSessionKeys[temp[0]].keys;
        if (temp0[temp[1]]) {
          elem = temp0[temp[1]].value;
        }

      }
    } else {
      if (this.userSessionKeys[temp[0]]) {
        elem = this.userSessionKeys[temp[0]].value;
      }
    }
    return elem;
  }
  /***********************************************************************************************
   * return obervable for only key in data object
   * @param key
   */

  removeSessionKey<T>(key: string, parent?: string) {

    if (parent && this.userSessionKeys[parent]) {
      delete this.userSessionKeys[parent][key];
    } else {
      delete this.userSessionKeys[key];
      // let indx = (this.subjectsarr.findIndex(a => a.subkey == key));
      // this.subjectsarr.splice(indx, 1);
      this.subjectsarr = this.subjectsarr.filter((item) => {
        if (item.subkey != key) {
          return item
        }
      })

    }
  }
  deleteSubjectarr() {
    this.subjectsarr.forEach((item, index) => {
      if (this.deleteableKey(item.subkey)) {
        this.subjectsarr.splice(index, 1);
      }
    })
  }
  /**********************************************************************************************
   * used to listen in all object data
   * return observable for data object
   * @param key
   */


  /*************************************************************************************************
   * return data object
   */
  setModalKeys(modalName: string, parentName?: string, inputsObj?: any) {
    this.modalKeys[modalName] = { name: modalName, parent: parentName, isClose: null, inputs: inputsObj, output: null };
    this.modalKeys$.next(this.modalKeys[modalName]);
  }

  /*************************************************************************************************
  *
  */
  getModalKey<T>(modalName: string): T {
    return this.modalKeys[modalName];
  }
  /*************************************************************************************************
  *
  */
  getAllModalKeys() {
    return this.modalKeys;
  }
  /*************************************************************************************************
  *
  */
  getModalKey$(): Observable<any> {
    return this.modalKeys$.asObservable();

  }

  /*************************************************************************************************
  * 
  */
  closeModalKey(modalName: string, outputObj) {
    if (this.modalKeys[modalName]) {
      this.modalKeys[modalName].isClose = true;
      this.modalKeys[modalName].output = outputObj;
      this.modalClose$.next(this.modalKeys[modalName]);
      this.removeModalKeys(modalName);
    }
  }
  /*************************************************************************************************
  * 
  */
  onModalClose$() {
    return this.modalClose$.asObservable();
  }
  /*************************************************************************************************
 * 
 */
  removeLinkKeys(newLink) {

    const oldLinkProp = Object.getOwnPropertyNames(this.userSessionKeys).find(name => name == 'link');
    if (!oldLinkProp) {
      return;
    }
    const oldLinkValue = this.userSessionKeys[oldLinkProp];
    if (!oldLinkValue && !oldLinkValue.value) {
      return;
    }
    if (newLink.code != oldLinkValue.value.code) {
      let keys = Object.getOwnPropertyNames(this.userSessionKeys);
      keys.forEach((value, index, array) => {
        if (this.deleteableKey(value)) {
          this.removeSessionKey(value);
          this.UIState = {};
        }
      }
      );
    }

    //--
    this.deleteSubjectarr();
  }
  deleteableKey(key: string) {
    if (key != 'DashBoardParms' &&
      key != 'SecLoginPrivileges' &&
      !key.endsWith('RouterParms') &&
      !key.endsWith('TRANSSERIAL') &&
      !key.endsWith('PermisionType') &&
      !key.endsWith('ExaminationType') &&
      !key.endsWith('link') &&
      // !key.endsWith('FastSearchCached') &&
      !key.endsWith('toggleFavArea') &&
      !key.endsWith('tabType') &&
      !key.endsWith('cashierParms') &&
      !key.endsWith('receiptSerial') &&
      !key.endsWith('parentServiceObj') &&
      !key.endsWith('extractedClaim') &&
      !key.endsWith('GetItemsTemplate') &&
      !key.endsWith('ObtCashDue') &&
      !key.endsWith('EmployeesPanner')
    ) {

      return true;
    }
    return false;
  }
  /*************************************************************************************************
* 
*/
  removeModalKeys(value: string) {
    delete this.modalKeys[value];

  }

  setBtnCtrl(_btnsCtrl) {
    this.btnCtrlViewChild = _btnsCtrl;
  }

  getBtnCtrl() {
    return this.btnCtrlViewChild;
  }

  UIActiveTree: { appCpdesid: number, status: boolean }[] = [];
  //-------------------
  setUIState(e: any, parentUIKey: string) {
    //--------------------------
    let tree = this.initUiTree(parentUIKey);
    this.deActivateUi(tree, parentUIKey);
    tree[parentUIKey]['childs'][e.serial] = true;


    if (!this.UIState['UIActive']) { this.UIState['UIActive'] = {} };
    this.UIState['UIActive'][e.serial] = true;
    this.setUIKeyVisited(e.serial);
    this.tellUIKeyObservers(e, parentUIKey);
    //Utility.UiActive = this.UIState['UIActiveTree']
    if (this.UIState['UIActiveTree'] && this.UIState['UIActiveTree']['undefined']) {
      Utility.test = this.UIState['UIActiveTree']['undefined']['childs']
      let x = [];
      x = Object.entries(Utility.test)
      let y = x.filter(s => s[1] == true)
      let indexes = [];
      for (let i = 0; i < y.length; i++) {
        indexes.push(y[i][0])
      }
      Utility.UiActive = indexes.join('-')
    }
    //Utility.UiActive = indexes.join('-')
    //  let exist = this.UIActiveTree.filter(book => book.appCpdesid == e.serial)
    //  if(exist && exist.length == 0){
    //     this.UIActiveTree.push({ appCpdesid: e.serial , status: false}  )
    //  }
    //   this.UIActiveTree.forEach(element => {
    //     if(element &&  element.appCpdesid == e.serial){
    //       element.status = true;
    //     }
    //   });

    // this.UIState['UIActive']['12']
  }
  //const FilterTrue =  (UIState : string)=> UIState.filter(UIState == true)

  tellUIKeyObservers(e: any, parentUIKey: string) {
    const key = e.serial + '__' + parentUIKey;
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined)
      this.subjectsarr.push({ subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) });

    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    dd$.behaviorSubjectObj.next({ keyValue: key, isActive: true });
  };
  private setUIKeyVisited(key: string) {
    if (!this.UIState['UIVisited']) { this.UIState['UIVisited'] = {} };
    this.UIState['UIVisited'][key] = true;
  }
  initUiTree(parentUIKey: string) {
    if (!this.UIState['UIActiveTree']) { this.UIState['UIActiveTree'] = {} };
    let tree = this.UIState['UIActiveTree'];
    tree[parentUIKey] = tree[parentUIKey] || {};
    tree[parentUIKey]['childs'] = tree[parentUIKey]['childs'] || {};
    return tree;
  }
  private deActivateUi(uitree, parentUIKey) {
    if (uitree[parentUIKey] && uitree[parentUIKey]['childs']) {
      Object.keys(uitree[parentUIKey]['childs']).forEach(key => {
        this.deActivateUi(uitree, key);
        uitree[parentUIKey]['childs'][key] = false;
        this.UIState['UIActive'][key] = false;
      });
    }
  }
  activateUiKey(key, parentUIKey) {
    this.setUiKey(key, parentUIKey, true);
    this.setUIKeyVisited(key);
  }
  deActivateUiKey(key, parentUIKey) {
    this.setUiKey(key, parentUIKey, false);
  }
  private setUiKey(key: string, parentUIKey: string, flag: boolean) {
    let tree = this.initUiTree(parentUIKey);
    tree[parentUIKey]['childs'][key] = flag;
    if (this.UIState['UIActive'])
      this.UIState['UIActive'][key] = flag;

  }

  queryUIKey(key: string, parentUIKey: string): boolean {
    let tree = this.initUiTree(parentUIKey);
    let keyVal = tree[parentUIKey]['childs'][key];
    if (keyVal == undefined) keyVal = false;
    return keyVal;
  };
  queryParentUIKey(parentUIKey: string) {
    let tree = this.initUiTree(parentUIKey);
    return tree[parentUIKey] ? true : false;
  }
  queryVisitedUI(key: string, parentUIKey: string) {
    let keyVal = this.UIState['UIVisited'] ? this.UIState['UIVisited'][key] : false;
    if (keyVal == undefined) keyVal = false;
    return keyVal;
  };

  //---------------------------
  getUIState$(key: string) {
    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    if (dd$ == undefined) {
      dd$ = { subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) }
      this.subjectsarr.push(dd$);
    }
    return dd$.behaviorSubjectObj.asObservable();
  }
  setUIStateAction(_action: Action): boolean {
    let key = UISessionKeys.Transactions;
    //---------------------------------
    switch (_action.type) {
      case UIAction.TabActived:
        key = UISessionKeys.ActivatedAppCodes;
        this.UIState[key] = Object.assign({}, this.UIState[key], _action.payload);
        break;
      case UIAction.AddTrans:
      case UIAction.CommitTrans:
      case UIAction.RollbackTrans:
      case UIAction.TransStepped:
      case UIAction.AddAndStepTrans:
        this.UIState[key] = Object.assign({}, this.UIState[key], { 'name': _action.payload, 'status': _action.type });
        break;
      default:
        break;

    }
    this.propagateUIState(key);
    return true;
  }
  checkTransStatus(_action: Action): boolean {

    const key = UISessionKeys.Transactions;
    const status = this.UIState[key] ? this.UIState[key]['status'] : '';
    const transName = this.UIState[key] ? this.UIState[key]['name'] : '';
    let msg = '';
    switch (_action.type) {
      case UIAction.OpenNewLink:
        if (status == UIAction.TransStepped) {
          // console.log('previous transaction not completed. ');
          this.askForTransCancel(transName);
          return false;
        }
        break;
      case UIAction.AddTrans:
      case UIAction.AddAndStepTrans:
        if ((status == UIAction.TransStepped || status == UIAction.AddAndStepTrans) && transName != _action.payload) {
          // console.log('previous transaction not completed ');
          this.askForTransCancel(transName);
          return false;
        }
        break;
      case UIAction.CommitTrans:
        if (status == UIAction.RollbackTrans || status == UIAction.CommitTrans) {
          alert('previous trans allready ended ');
          return false;
        }
        break;
      case UIAction.RollbackTrans:
        if (status == UIAction.RollbackTrans || status == UIAction.CommitTrans) {
          alert('previous trans  ended ');

          return false;
        }
        break;
    }
    return true;
  }
  askForTransCancel(transName: string) {
    this._modalService.activeTranslatedMesg('UI95').then(response => {
      if (response) {
        this.setUIStateAction({ type: UIAction.RollbackTrans, payload: transName })
      } else {

      }
    });
  }
  propagateUIState(key: string) {
    let x$ = (this.subjectsarr.find(a => a.subkey == key));
    if (x$ == undefined)
      this.subjectsarr.push({ subkey: key, behaviorSubjectObj: new BehaviorSubject<any>({}) });

    let dd$ = (this.subjectsarr.find(a => a.subkey == key));
    dd$.behaviorSubjectObj.next(this.UIState[key]);

  }
  resetUIState(_action: Action): boolean {
    if (!this.checkTransStatus(_action)) {
      return false;
    }
    this.UIState = {};
    return true;
  }
  dispatch(_action: Action) {
    if (this.dispatcher)
      this.UIState['TransData'] = this.dispatcher(this.UIState['TransData'], _action);
  }
  queryStor(_action: Action) {
    if (this.dispatcher)
      return this.dispatcher(this.UIState['TransData'], _action);
  }
  getStore(_action: Action) {
    switch (_action.type) {
      case UIAction.GetTransData:
        return this.UIState['TransData'];
    }
  }

  beginTransaction(transName: string) {
    this.setUIStateAction({ type: UIAction.AddTrans, payload: transName });
  };
  /**
   * 
   * @param reducer (reducer function ) pure function use
   */
  setdispatcher(reducer: any) {
    this.dispatcher = reducer;
  };
  getTransactionData(): any {
    return this.getStore({ type: UIAction.GetTransData });
  };


  public get getCurrentMode(): number {
    let currentLink = JSON.parse(sessionStorage.getItem('LinkObj'));
    return +currentLink ? +currentLink.mode : 0 | 0;
  }

  public get checkUserMobile(): boolean {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window['opera']);
    return check;
  }

  public get getOrientationType(): string {
    if (screen && screen.orientation && screen.orientation.type)
      return screen.orientation.type.split('-')[0];
    else return '';
  }

  get getBranchId(): number {
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return currentUser && currentUser.userID ? +currentUser.branchId : 0;
  }

  inqueryPatient: Subject<boolean> = new Subject<boolean>();
  inquerypatient$ = this.inqueryPatient.asObservable();
  setInqueryPatient(value: boolean) {
    this.inqueryPatient.next(value);
  }

}
import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators' ;import { Observable ,  Subject } from 'rxjs';
import { ActionIconService } from '../ui-component/action-icon/action-icon.service';
import { Config, unflatten } from '../../shared/arrayToTree';
import { UserSessionService } from '../../shared';

@Component({
  selector: 'vertical-list',
  templateUrl: 'vertical-list.component.html',
  styleUrls: []

})
export class VerticalList implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() private emitBed: EventEmitter<any> = new EventEmitter<any>();
   moveService: boolean;
   
  config: Config;
  // @Input() data: any;
  @Input() customConfig: Config;
  @Input() moveServiceFlag:number;
  @Input() appCodes: any[]; 
  groups: any[];
  currentGroupCode: number;
  currentItem: any;
  _arguments = [];
  @Input() get data() {
    return this._arguments;
  }
  set data(group) {
    this._arguments = group;
    this.drawData(this._arguments);

  }

  constructor(
    public translate: TranslateService,
    private _userSessionService: UserSessionService,
    private actionIconService: ActionIconService

  ) {
    this.clicked = new EventEmitter<any>();
    this.config = { id: 'code', parentId: 'parentCode' };
  }

  ngOnInit() {
    if ( this.appCodes){
      this._getControls2();
    }
    else {
      this.drawData(this.data);
    }
   
  }

  drawData(data) {
    if (this.customConfig) { this.config = this.customConfig }
    if (this.data.length == 0) {
      this.groups = [];
    }
    else {
      this.groups = unflatten(this.data, { id: this.config.id, parentId: this.config.parentId });
      this.groups.forEach(key => { key['clicked'] = false });
      this.groups[0].clicked = true;
    }
  }

  ngAfterViewInit() {
  }
  /**call i create stepper steps from appcodes not from link id   */
  _getControls2() {
    this.actionIconService
      .getControls(this.appCodes.toString())
      .subscribe(apps => {
        if (apps && apps.data && apps.data.length > 0) {
          this.groups = apps.data;
          this.groups.forEach(key => { key['clicked'] = false });
          this.groups[0].clicked = true;
        }
      }, null,
      () => {
        this.afterLoadComplete();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
  onGroupClick(group: any,index:number) {
   
    this.moveService=false
    this._userSessionService.setSessionKey('moveServiceToOtherVistSerial', this.moveService);
    this.activateTab(index);
    this.clicked.emit(group);
    this.currentGroupCode = group[this.config.id];
  }

  activateTab(index:number) {
    this.groups.forEach(key => { key.clicked = false });
    this.groups[index].clicked = true;
    
}

  onItemClick(item: any) {
      this.emitBed.emit(item);
  }
  OnMoveServiceClick() {
      this.moveService=true
      this._userSessionService.setSessionKey('moveServiceToOtherVistSerial', this.moveService);
    
  }
  afterLoadComplete() { }
}
 


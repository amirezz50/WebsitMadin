import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// services
import { CountsDashBoardService } from './counts-dashboard.service';
import { UserSessionService } from '../../app-user-session.service';
import { Module } from '../../modules/modules';
@Component({
    selector: 'counts-dashboard',
    templateUrl: 'counts-dashboard.component.html',
    styleUrls: ['counts-dashboard.component.css']
})

export class CountsDashboardComponent implements OnInit {
  //CountsDashBoardService

  constructor(
    private _CDBService: CountsDashBoardService,
    private _USS: UserSessionService,
    public translate: TranslateService
    ) {
    
    }
    @Output() clicked = new EventEmitter<any>();
    public _data: CountsDashboardInterface[];
    countsList = [];
    @Input() get data(): CountsDashboardInterface[] {
        return this._data;
    }
    set data(val: CountsDashboardInterface[]) {
      if (val) {
           this.countsList.push(val);
            this._data = val; 
            this.hidden = false; 
        }
    }
    hidden = true;
    
    ngOnInit() {
      this.getCounts();
    }
    getCounts() {
      let link = <Module>this._USS.getSessionKey('link');
      let parms = {}
      if (link)
        parms = { moduleCode: link.parentCode, 'linkCode': link.code };
      

      let countsParms = { jsonObject: JSON.stringify(parms) , formKey: 1 };
      this._CDBService.getCounts(countsParms).subscribe(res => {
        if (res && res.data && res.data.length > 0) {
          this.data = res.data; 
          this.afterGetCountComplete();
        }
      }, null,
        () => {
          this.afterGetCountComplete();
      });


      //this._CDBService.useRestApi().subscribe(res => {
      //}
      //);
      
    }
    afterGetCountComplete() { };
    // on click in any item from ui
    emitSelectCount(selectCount) {
      this.goToCount(selectCount);
    }
    /**
     * used to step out form item until value
     * @param value item in counts list 
     */
    goToCount(value:CountsDashboardInterface) {
        if (this.countsList.length > 0) {
            for (let i = this.countsList.length - 1; i > -1; i--) {
                if (this.countsList[i].code == value.code) {
                    break;
                }
                this.countsList.pop();
            }
            this.clicked.emit(this.countsList[this.countsList.length - 1]);
        }
    }
}
export interface CountsDashboardInterface{
    code: number;
    moduleCode?: number;
    nameAr: string; 
    nameEn: string;
    vlaue: string;
    fa_IconName?: string;
    cValueStr?: any;
}

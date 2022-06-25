import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// services

@Component({
    selector: 'breadcrumb',
    templateUrl: 'breadcrumb.component.html',
    styleUrls: ['breadcrumb.component.css']
})
/** hints for using component
 * set type = 'in' for new item want to add to breadcrumb
 * set type = 'out' for item you want to remove all above item
 * set areaName = [your area name =>{name: true}] to used to hide show div from master component
 *
 * please in master component set
 * setBreadcrum method to set new item =>
 *   setBreadCrumb(type: string, code, nameAr?, nameEn?, areaName?) {
                this.breadCrumbData = Object.assign({},
                 { type: type, code: code, nameAr: nameAr, nameEn: nameEn, areaName: areaName });
                this.areaViewerManager = areaName;
        }
    call =>    this.setBreadCrumb('in', 670, content.nameAr, content.nameEn, { sheetArea: true });

 * set onBreadCrumbClick to accept emited clicked item from breadcrumb component =>
 *   onBreadCrumbClick(event) {
            if (event) {
            this.areaViewerManager = event['areaName'];
            }
        }
  call =>     this.setBreadCrumb('out', 670);
 */
export class BreadcrumbComponent implements OnInit {

    @Output() clicked = new EventEmitter<any>();
    public _data: BreadCrumbInterface;
    areaList = [];
    @Input() get data(): BreadCrumbInterface {
        return this._data;
    }

    set data(val: BreadCrumbInterface) {
        if (val) {
            if (val['type'] == 'in') { // type for set new item in breadcrumb
                const temp = this.areaList.findIndex(element => element.code == val.code); // check if val is old item
                if (temp == -1) {
                    this.areaList.push(val); // add tiem
                } else {
                    this.areaList[temp] = Object.assign({}, val); // change old item (clone new value)
                }
            } else if (val['type'] == 'out') {// type of stepout to item in breadcrumb
                this.goToStep(val);
            }
            this._data = val; // old code
            this.hidden = false; // old code
        }
    }
    child = 1;
    hidden = true;
    constructor(
        public translate: TranslateService
    ) {
    }
    ngOnInit() {

    }

    setDefaultBreadcrumb() {
    }
    // got ot home item
    getHome() {
        this.areaList = [];
        this.data = <BreadCrumbInterface>{};
        this.hidden = true;
        this.clicked.emit(0);
    }
    // on click in any item from ui
    emitSelectArea(selectArea) {
        this.goToStep(selectArea);
    }
    /**
     * used to step out form item until value
     * @param value item in breadcrumb items
     */
    goToStep(value:BreadCrumbInterface) {
        if (this.areaList.length > 0) {
            for (let i = this.areaList.length - 1; i > -1; i--) {
                if (this.areaList[i].code == value.code) {
                    break;
                }
                this.areaList.pop();
            }
            this.clicked.emit(this.areaList[this.areaList.length - 1]);
        }
    }
}

export interface BreadCrumbInterface{
    type: 'in' | 'out';
    code: number;
    nameAr: string; 
    nameEn: string;
}
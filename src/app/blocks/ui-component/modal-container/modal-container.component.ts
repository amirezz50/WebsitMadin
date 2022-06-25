
import {
    Component, OnInit, AfterViewInit, ViewChild, OnDestroy,
    Input, Output, EventEmitter, TemplateRef,
    ChangeDetectorRef
} from '@angular/core';

import { takeUntil } from 'rxjs/operators' ;  import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

import { NgbModal } from '../../../ng-bootstrap/index';
import { UserSessionService } from '../../../app-user-session.service';


@Component({
    selector: 'block-modal-container',
    templateUrl: './modal-container.component.html'
})
export class ModalContainerComponent implements OnInit, AfterViewInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    /** type of modal 
     **  1 for close btn only
     **  2 for close btn an save btn 
     */
   @ViewChild('popup',{static: false})
    private popupcontent: TemplateRef<any>;


    @Output() close: EventEmitter<any> = new EventEmitter();
    @Input() type: number = 1;
    @Input() popupName: string;
    // @Input() size: "sm" | "lg" | "xl";

    // private _size: "sm" | "lg" | "xl";
    // @Input()
    // set size(value: "sm" | "lg" | "xl") {
    //     this._size = value;
    // }
    // get size(): "sm" | "lg" | "xl" {
    //     return this._size;
    // }

    constructor(
        private _modalService: NgbModal,
        private userSessionService: UserSessionService
    ) { }

    ngOnInit() {


    }
    ngAfterViewInit() {
        this.userSessionService
            .onModalClose$().pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                if (this.popupName == res.name) {
                    this.close.emit(res);
                    if (document.getElementById(this.popupName))
                        document.getElementById(this.popupName).click();
                }

            });
    }
    ngOnDestroy() {

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

    }

    openModal(dynamicComponent: string, parent?: string, inputs?: any, modalSize?: "sm" | "lg" | "xl"): void {
        let inputsCopy = Object.assign({}, inputs);
        this.userSessionService.setModalKeys(dynamicComponent, parent, inputsCopy);
       // if (!this.popupName) {
            this.popupName = dynamicComponent;
       // }
        this._modalService.open(this.popupcontent, { size: modalSize })
            .result
            .then((result) => {
            },
                (reason) => {
                    this.userSessionService.closeModalKey(this.popupName, reason);
                });
    }

    openContent() {
        return this._modalService.open(this.popupcontent)
    }

    openContentNGTemplate() {
        return this._modalService.open(this.popupcontent)
    }
}


@Component({
    selector: 'modal-container',
    template: `
            <block-modal-container>
            </block-modal-container>
    `
})
export class loadedComponent implements OnInit {

    @Input() loadedComponent: any;
    constructor(
    ) { }

    ngOnInit() {
    }



}


import { Component, OnInit } from '@angular/core';

import { ToastService } from './toast.service'

@Component({
    selector: 'toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
    private _defaults = {
        title: '',
        message: 'May the Force be with You'
    };
    title: string;
    message: string;

    private _toastElement: any;
  

    constructor(
        toastService: ToastService) {
        toastService.activate = this.activate.bind(this);
    }
     // 1:success ; 2:error ; 3:warning
    activate(message = this._defaults.message, title = this._defaults.title, messageType?: number) {
        this.title = title;
        this.message = message;

        this._show(messageType);
    }

    ngOnInit() {
        this._toastElement = document.getElementById('toast');
    }

    private _show(messageType:number) {
        console.log(this.message);
        //this._toastElement.style.opacity = 1;
        this._toastElement.style.zIndex = 9999;
        this._toastElement.style.display = "block";

        if (messageType == 1)
            this._toastElement.style.background = "#4CAF50";
        else if (messageType == 2)
            this._toastElement.style.background = "#FF5252";
        else 
            this._toastElement.style.background = "#FFC107";

        window.setTimeout(() => this._hide(), 2500);
    }

    private _hide() {
        this._toastElement.style.display = "none";
        window.setTimeout(() => this._toastElement.style.zIndex = 0, 400);
    }
}

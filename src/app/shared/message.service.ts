import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { CONFIG } from './config';
import { ToastService } from '../blocks/toast/toast.service';

export interface IResetMessage {
    message: string
}

@Injectable()
export class MessageService {
    private _subject = new Subject<IResetMessage>();
    state = <Observable<IResetMessage>>this._subject;

    constructor(private _http: HttpClient,
        private _toastService: ToastService) {
    }
}

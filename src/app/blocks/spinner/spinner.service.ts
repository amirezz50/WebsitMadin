import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ISpinnerState {
    show: boolean
}

@Injectable()
export class SpinnerService {
    private _spinnerSubject = new Subject<ISpinnerState>();

    spinnerState = <Observable<ISpinnerState>>this._spinnerSubject;

    show() {
        this._spinnerSubject.next(<ISpinnerState>{ show: true });
    }

    hide() {
        this._spinnerSubject.next(<ISpinnerState>{ show: false });
    }
}

import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastService } from './toast/toast.service';

@Injectable()
export class ExceptionService {

  constructor(private _toastService: ToastService) { }

  catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {

    let err = <HttpErrorResponse>errorResponse;
    let emsg;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      emsg = err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (err.status == 0) {
        emsg = `Backend returned code ${err.status}, body was: ${err.message}`;
      } else {
        emsg = `Backend returned code ${err.status} (${err.statusText}), body was: ${err.error ? err.error.value : err.message}`;
      }
    }

    this._toastService.activateRequestError(emsg, err.error);
    // return Observable.throw(emsg); // TODO: We should NOT swallow error here.
    return observableOf();
  }
}

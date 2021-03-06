import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ISpinnerState, SpinnerService } from './spinner.service';

const ACTIVE_CLASS = 'is-active';

@Component({
    selector: 'story-spinner',
    template: `
    <div [hidden]="!visible"      class="spinner mdl-spinner mdl-js-spinner mdl-spinner--single-color"
      [class.is-active]="visible"></div>
  `,
    styles: [`.spinner {position: absolute;left: 46%;top: 12%`]
})

export class SpinnerComponent implements OnDestroy, OnInit {
    visible = false;

    private _spinnerStateChanged: Subscription;

    constructor(private _spinnerService: SpinnerService) { }

    ngOnInit() {
        this._spinnerStateChanged = this._spinnerService.spinnerState
            .subscribe((state: ISpinnerState) => this.visible = state.show);
    }

    ngOnDestroy() {
        this._spinnerStateChanged.unsubscribe();
    }
}
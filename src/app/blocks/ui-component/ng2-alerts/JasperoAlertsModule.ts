import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertsComponent} from './alerts.component';
import {AlertsService} from './alerts.service';
import {AlertComponent} from './alert.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export * from './alert.component';
export * from './alerts.component';
export * from './alerts.service';
export * from './interfaces/alert-emit';
export * from './interfaces/alert-settings';
export * from './interfaces/alert-type';

@NgModule({
    imports: [CommonModule],
    declarations: [
        AlertsComponent,
        AlertComponent
    ],
    providers: [AlertsService],
    exports: [AlertsComponent]
})
export class JasperoAlertsModule {}

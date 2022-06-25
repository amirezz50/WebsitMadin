
import { NgModule } from '@angular/core';
import { LoggedInGuard } from './../shared';
import { Routes, RouterModule } from '@angular/router';
import { DbrTapsComponent } from './dbr-taps-dev';
import { DprSetupComponent } from './dpr-setup';
import { DbrParmsComponent } from './dbr-parms';
import { DbrOutputsComponent } from './dbr-outputs';
import { DbrParmsUserComponent } from './dbr-parms-user';
import { DbrSetupUserComponent } from './dbr-setup-user';
import { DbrTapsUserComponent } from './dbr-taps-user';
const routes: Routes = [
    {
        path: '', children: [
          { path: '', redirectTo: 'dynamicBusinessRule/dbrTapsDev', pathMatch: 'full' },
            // dbr dev rule setting
          { path: 'dbrTapsDev', component: DbrTapsComponent },
          { path: 'dbrTapsUser', component: DbrTapsUserComponent },
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DynamicBusinessRuleRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// import { AppCustomPreloader } from './app-routing-loader';

import { NotFoundComponent } from './not-found.component';
// import { MyRouterErrorHandler } from './custom-error-handler'; 


const appRoutes: Routes = [
    { path: '', redirectTo: '/portal/login', pathMatch: 'full' },
    { path: 'portal', loadChildren: () => import('./patient-portal/patient-portal.module').then(m => m.PatientPortalModule) },

    // -----------stock transaction --------------------------------------------------------------------------------
  {
        path: 'dynamicBusinessRule',
        loadChildren: () => import('./dynamic-business-rule/dynamic-business-rule.module').then(m => m.DynamicBusinessRuleModule)
    },

  { path: 'docu-manage-new', loadChildren: () => import('./docu-manage-new/docu-manage-new.module').then(m => m.docuMangeNewgModule) },

    //{ path: 'rx', loadChildren: './rx/rx.module#RXModule' },
    { path: 'report', loadChildren: () => import('./blocks/dev-express-viewer/dev-express-report.component').then(m => m.DevExpressReportModule) },

 
    //----------------------------------Electronic Invoice----------------------------------//
  //---------------------------TimeSlots------------------------------//
    {path:'TimeSlots',loadChildren:()=> import('./blocks/timeSlotPicker/TimeSlotPicker.module').then(m=>m.TimeSlotPickerModule)},


    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' },

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        //  preloadingStrategy: AppCustomPreloader 
        //  errorHandler: MyRouterErrorHandler  
    })],
    declarations: [
        NotFoundComponent
    ],
    exports: [RouterModule],
    // providers: [AppCustomPreloader]
})

export class AppRoutesModule { }

import { HttpClientModule } from '@angular/common/http';
// angular modules

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
// import { HttpModule, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** --------------------------------------------------------------------------------- **/
// app component modules
import { AppComponent } from './app.component';
import { AppRoutesModule } from './app.routing';

/** --------------------------------------------------------------------------------- **/
// main module
/** --------------------------------------------------------------------------------- **/

// import { IdentityTypesComponent } from './blocks/identity_type/identity_types.component';
// import { NamesComponent } from './blocks/names/names.component';
import { BlocksModule } from './blocks/blocks.module';
import { CountsDashBoardModule } from './blocks/counts-dashboard/counts-dashboard.module';
/** --------------------------------------------------------------------------------- **/
// ui modules
import { NgbModule } from './ng-bootstrap/index';
import { ToastrModule } from 'ngx-toastr'; /** --------------------------------------------------------------------------------- **/
// services

import { HttpGeneralService } from './shared/http-general.service';
import { CountsDashBoardService } from './blocks/counts-dashboard/counts-dashboard.service';
import { SharedModule, MessageService, Navbar, AuthService, FormSettingsService } from './shared';
import { LoggedInGuard } from './shared';
import { UserSessionService } from './app-user-session.service';
/** --------------------------------------------------------------------------------- **/
// directives
import { DropdownDirective } from './dropdown.directive';
/** --------------------------------------------------------------------------------- **/
// general helper modules
// transelate module
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CKEditorModule } from 'ngx-ckeditor';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
// ----------------------------------------------------------------------
import {
    EntityService,
    ModalService,
    ToastService,
    ControlsService,
    FilterService,
    ExceptionService,
    SpinnerService,
    SpinnerComponent,
    ToastComponent,
    ModalComponent,
    LinkTypePipe
} from './blocks';

// import { CustomErrorHandler } from './custom-error-handler';
import { ModulesComponent } from './modules/modules.component';
import { ModuleService } from './modules/module.service';
import { NotifySignalrService } from './shared/notify-signalr.service';
import { AlertService } from './shared/notify-and-alert.service';
import { MailModule } from './blocks/mail/mail/mail.component';
import { NewSignalrAlertService } from './shared/new-signalr-alert.service';
import { imageUploadAllService } from './docu-manage-new/image-upload-all/image-upload-all.service';
import { DatePipe } from '@angular/common';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {NgxPaginationModule} from 'ngx-pagination';
import { PatientPortalModule } from './patient-portal/patient-portal.module';




//import { AgmCoreModule } from '@agm/core';


// import { ZoneListener } from './shared/zone.listener';


@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
        ToastComponent,
        ModalComponent,
        LinkTypePipe,
      
        // Directives
        DropdownDirective,
        Navbar
      


    ],
    imports: [
        // angular modules
        //HttpClientModule,
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        ToastrModule.forRoot(),
        // general modules
        BlocksModule,
        BrowserModule,
        SharedModule,
        CountsDashBoardModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MailModule,
        // AgmCoreModule.forRoot({
        //     apiKey: 'AIzaSyAcrIrPWIItAnQPI6X3AAUKqxzboPb74p0'
        //   }),
        //////Main Modules ************************************************-
        // lazy laod module
        // IdentityTypesComponent,
        // NamesComponent,
        ModulesComponent,
        // used last module in all time for matched url
        AppRoutesModule,
        CKEditorModule,
        NgxQRCodeModule,
        PatientPortalModule
        
    ],
    exports: [BrowserModule, DropdownDirective],

    providers: [
        HttpClient,
        EntityService,
        ModalService,
        FilterService,
        ToastService,
        
        ExceptionService,
        MessageService,
        ControlsService,
        SpinnerService,
        AuthService,
        FormSettingsService,
        LoggedInGuard,
        UserSessionService,
        HttpGeneralService,
        ModuleService,
        CountsDashBoardService,
        NotifySignalrService,
        NewSignalrAlertService,
        AlertService,
        imageUploadAllService,
        DatePipe
        // { provide: ErrorHandler, useClass: CustomErrorHandler },
        // ZoneListener,
        // { provide: RouteReuseStrategy, useClass: PreventErrorRouteReuseStrategy },
        // { provide: APP_BASE_HREF, useValue: location.pathname }
    ],
    entryComponents: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA] // add this line
})
export class AppModule {

    constructor() {
    }
}



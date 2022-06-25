
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EqualValidator } from './validation';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// angular material modules
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

// transelate module
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// pipes 
import { SelectedDirective } from './selecteditem.directive';

import { MvcPartialDirective } from './mvc-partial.directive';

// import { DatePicker } from 'ng2-datepicker/ng2-datepicker';
import { DataTableModule } from '../primeng/datatable/datatable';
import { TreeTableModule } from '../primeng/treetable/treetable';
import { InputsMaskModule } from './inputsmask.directive';
//
import { NgbModule } from '../ng-bootstrap/index';
// import { HttpGeneralService } from './Http-General.Service';
//
// import { FastSearchModule } from '../blocks/ui-component/fast-search/fast-search.module';

// services
import { SharedDateService } from './date.service';
import { FormGroupCreationService } from './reactiveForm.creation.service';
// our custom
import { ControlsModule } from '../blocks/controls/controls.module';
import { SelectizeModule } from '../blocks/selectize';
import { LoaderModule, Loader, StaticLoader } from '../ng2-loader/ng2-loader';
// import { IconActionComponent } from '../blocks/ui-component/action-icon/action-icon.component';
import { ActionIconService } from '../blocks/ui-component/action-icon/action-icon.service';
import { IconActionModule } from '../blocks/ui-component/action-icon/action-icon.module';
import { TabindexDirective } from './tabindex.directive';
import { EventEmitterService } from './event-emitter.service';
import { FhirService } from './fhir.service';



export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function createStaticLoader(http: HttpClient) {
    return new StaticLoader(http, '/setting', '.json');
}


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // HttpModule,
        HttpClientModule,
        DataTableModule,
        TreeTableModule,
        ControlsModule,
        InputsMaskModule,
        SelectizeModule,
        NgbModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        LoaderModule.forRoot({
            provide: Loader,
            useFactory: (createStaticLoader),
            deps: [HttpClient]
        }),
        MatMenuModule,
        MatButtonModule,
        MatExpansionModule
    ],
    declarations: [
        MvcPartialDirective,
        EqualValidator,
        // pipes
        SelectedDirective,
        TabindexDirective
    ],
    providers: [
        // HttpGeneralService,
        SharedDateService,
        FormGroupCreationService,
        ActionIconService,
        EventEmitterService,
        FhirService
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // HttpModule,
        InputsMaskModule,
        HttpClientModule,
        TranslateModule,
        LoaderModule,
        ControlsModule,
        DataTableModule,
        TreeTableModule,
        IconActionModule,
        // FastSearchModule,
        SelectizeModule,
        NgbModule,
        MvcPartialDirective,
        EqualValidator,
        MatMenuModule,
        MatButtonModule,
        MatExpansionModule,
        TabindexDirective
    ]
})
export class SharedModule {

    // static forRoot(): ModuleWithProviders {

    //    function translateLoader(http: Http) {
    //        return new TranslateStaticLoader(http, 'i18n', '.json');
    //    }
    //    return {
    //        ngModule: SharedModule,
    //        providers: [
    //            SharedDateService,
    //            FormGroupCreationService,
    //            {
    //                provide: TranslateLoader,
    //                useFactory: translateLoader,
    //                deps: [Http]
    //            },
    //            TranslateService],
    //    }
    // }

}

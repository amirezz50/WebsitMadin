import { NgModule, ModuleWithProviders } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LoaderPipe } from "./loader.pipe";
import { LoaderService, Loader, StaticLoader } from "./loader.service";

export * from "./loader.pipe";
export * from "./loader.service";
export * from "./loader.parser";

export function LoaderFactory(http: HttpClient) {
    return new StaticLoader(http);
}

@NgModule({
    imports: [HttpClientModule],
    declarations: [
        LoaderPipe
    ],
    exports: [
        HttpClientModule, // todo remove this when removing the loader from core
        LoaderPipe
    ]
})
export class LoaderModule {
    static forRoot(providedLoader: any = {
        provide: LoaderService,
        useFactory: LoaderFactory,
        deps: [HttpClient]
    }): ModuleWithProviders {
        return {
            ngModule: LoaderModule,
            providers: [providedLoader, LoaderService]
        };
    }
}
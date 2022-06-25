import { CommonModule } from '@angular/common';
import { imageUploadAllService } from './image-upload-all/image-upload-all.service';
import { imageUploadNewService } from './image-upload-small/image-upload-new.service';

import { NgModule } from '@angular/core';
// shared modle 
import { SharedModule } from '../shared/shared.module';
import { BlocksModule } from '../blocks/blocks.module';


// ************************  Components & Services  ********************************
import { docuMangeNewRoutingModule } from "./docu-manage-new-route.module";
import { ImageUploadNewComponent } from "./image-upload-small/image-upload-new.component";
import { FileUploadModule } from "../blocks/file-upload/file-upload.component";
import { imageUploadAllComponent } from "./image-upload-all/image-upload-all.component";
import { FilesUploadComponent } from './image-upload-all/files-upload/files-upload.component';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { ScannerComponent } from './scanner/scanner.component';
// import { ScannerComponent } from './scanner/scanner.component';





@NgModule({
    imports: [
        CommonModule,
        BlocksModule,
        SharedModule,
        docuMangeNewRoutingModule,
        FileUploadModule,
        PinchZoomModule,
       
        // ScannerModule
     
    ],
    declarations: [
        ImageUploadNewComponent,
        imageUploadAllComponent,
        FilesUploadComponent,
         ScannerComponent
    ],
    exports: [
        FileUploadModule,
        ImageUploadNewComponent,
        FilesUploadComponent,
          ScannerComponent
    ],
    providers: [
        imageUploadNewService
    ]
})

export class docuMangeNewgModule { }

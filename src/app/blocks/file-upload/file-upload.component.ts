import { NgModule, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploader } from './file-uploader.class';
@Component({
    selector: 'file-upload',
    templateUrl: 'file-upload.component.html'
})
export class FileUploadComponent implements OnInit {

    public uploader: FileUploader = new FileUploader({});
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    uploadedImgeBase64: string;
    @Output() upload = new EventEmitter();

    constructor() {
    }


    ngOnInit() {
      let apiUrlNew = CONFIG.Urls.apiUrlNew;
      this.uploader.options.url = `${apiUrlNew}/api/v1/Journals/upload`;
    }


    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
    uploadAll(a) {
        this.upload.emit(a.queue);
    }

    readFile(ee) {
        

        if (this.uploader && this.uploader.queue[0]) {
            var FR = new FileReader();
            FR.addEventListener("load",  (e:any) => {
                let c = e;
                
                this.uploadedImgeBase64 = e.target.result;
                //document.getElementById("b64").innerHTML = e.target.result;
            });
            FR.readAsDataURL(ee.target.files[0]);
        }

    }
}

import { FileDropDirective } from './file-drop.directive';
import { FileSelectDirective } from './file-select.directive';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ModalContainerModule } from '../ui-component/modal-container/modal-container.module';
import { CONFIG } from '../../shared/config';
// import { ScannerComponent } from '../scanner/scanner.component';

@NgModule({
    imports: [
        CommonModule, 
        ModalContainerModule
    ],
    declarations: [
        FileUploadComponent,
        ImageUploadComponent,
        // ScannerComponent,
        FileDropDirective,
        FileSelectDirective
    ],
    exports: [
        FileUploadComponent,
        ImageUploadComponent,
        // ScannerComponent,
        FileDropDirective,
        FileSelectDirective
    ]
})

export class FileUploadModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { imageUploadAllComponent } from "./image-upload-all/image-upload-all.component";
import { FilesUploadComponent } from './image-upload-all/files-upload/files-upload.component';



const routes: Routes = [
    {
        path: "", children: [
            { path: "", redirectTo: "docu-manage-new/imageUploadAll", pathMatch: "full" },
            // { path: 'imageUploadAll', component: imageUploadAllComponent },
            { path: 'imageUploadAll/:id', component: FilesUploadComponent },
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
export class docuMangeNewRoutingModule { }


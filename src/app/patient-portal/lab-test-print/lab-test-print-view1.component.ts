
import { Component, OnInit, OnDestroy } from "@angular/core";
import { LabTestPrintMasterComponent } from "./lab-test-print-master.component";


@Component({
    selector:'LabTestPrintView1',
    templateUrl:'lab-test-print-view1.component.html',
    
}) 

export class LabTestPrintView1Component extends LabTestPrintMasterComponent implements OnInit, OnDestroy {

    ngOnInit(){
        super.ngOnInit()
    }
}
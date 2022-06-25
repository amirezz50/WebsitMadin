
import { Component, OnInit, OnDestroy } from "@angular/core";
import { LabTestPrintMasterComponent } from "./lab-test-print-master.component";


@Component({
    selector:'LabTestPrintView3',
    templateUrl:'lab-test-print-view3.component.html',
    
})

export class LabTestPrintView3Component extends LabTestPrintMasterComponent implements OnInit, OnDestroy {

    ngOnInit(){
        super.ngOnInit()
    }
}
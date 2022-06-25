
import { Component, OnInit, OnDestroy } from "@angular/core";
import { LabTestPrintMasterComponent } from "./lab-test-print-master.component";


@Component({
    selector:'LabTestPrintView4',
    templateUrl:'lab-test-print-view4.component.html',
    
})

export class LabTestPrintView4Component extends LabTestPrintMasterComponent implements OnInit, OnDestroy {

    ngOnInit(){
        super.ngOnInit()
    }
}
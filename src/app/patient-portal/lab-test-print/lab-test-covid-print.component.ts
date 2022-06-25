


import { Component, OnInit ,OnDestroy } from '@angular/core';

import { LabTestPrintMasterComponent } from './lab-test-print-master.component';
// import { LabActions } from '../lab-test/lab-test.component';

@Component({
  selector: 'app-lab-test-covid-print',
  templateUrl: './lab-test-covid-print.component.html'
})
export class LabTestCovidPrintComponent extends LabTestPrintMasterComponent implements OnInit, OnDestroy {

  ngOnInit() {
    super.ngOnInit()
  }
}

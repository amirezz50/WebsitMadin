


import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';

import { LabTestPrintMasterComponent } from './lab-test-print-master.component';
// import { LabActions } from '../lab-test/lab-test.component';

@Component({
  selector: 'app-lab-test-print',
  templateUrl: './lab-test-print.component.html',
  styleUrls: ['./lab-test-print.component.css']
})
export class LabTestPrintComponent extends LabTestPrintMasterComponent implements OnInit, OnDestroy {

  ngOnInit() {
    super.ngOnInit()
  }
}

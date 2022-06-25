import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbTimeStruct, NgbTimepicker} from '../../../ng-bootstrap/index';


@Component({
    selector: 'time-packer',
    styles: [`
        a:active {
            background-color: green;
        }
    `],
    template: ` <hr /><hr /><hr /><hr /><hr /><hr /><hr /> <div class="card card-block row">

        <ngb-timepicker #timepicker [(ngModel)]="time" [spinners]="false" [seconds]="false" ></ngb-timepicker>
       
        <span class="time-input-container ">
            <input [value]="item" class="time-input-field time-input is-timeEntry hasChanged"></span>
            <span class="time-input-icon fa fa-clock-o " (click)="click()" ></span>
            <button type="button" 
                    class="btn btn-secondary" 
                    [ngbPopover]="popContent" 
                    placement="bottom"
                    popoverTitle="timepicker">
              Hover over me!
            </button>

<ng-template #popContent>
        <div class="badge badge-default">
            <h4 >Hours</h4>
            <section class="row highlight fa-2x">
                <div *ngFor="let hour of Houres">
                    <a (click)="onHourClick(hour)">{{hour}}</a>
                </div>
        

            </section>

            <h4 >Minutes</h4>
            <section class="row highlight fa-2x">
                 <div *ngFor="let minute of Minutes">
                    <a (click)="onHourClick(minute)">{{minute}}</a>
                </div>
            </section>

            <section>
                <a data-bind="click: isPM.bind($component, false), css: {selected: !isPM()}">AM</a>
                <a data-bind="click: isPM.bind($component, true), css: {selected: isPM()}" class="selected">PM</a>
            </section>
            <!-- /ko -->
            </div>
</ng-template>
    </div>

        <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
          Popover on left
        </button>
`
     
})
export class TimePackerComponent implements OnInit  {

    clockHidden: boolean = true;
    item: string = '';
    Houres: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    Minutes: string[] = ['1', '5', '10', '15', '20', '25', '30', '35', '40', '45', , '50', '55', '60'];
        
    time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
    @ViewChild('timepicker', {static: false}) timepicker: NgbTimepicker;


    constructor() { }

    ngOnInit() {
    }

    clickshow() {
        this.clockHidden = !this.clockHidden;
    }

    click() {
        this.clockHidden = !this.clockHidden
    }

    onHourClick(item: string) {
        // this.timepicker.updateHours(item);
        // updateHour
        this.time.hour = 20;

    }
    onMinClick(item: number) {
        this.time.minute= item;

    }

}


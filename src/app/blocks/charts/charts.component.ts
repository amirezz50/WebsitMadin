import { Component, NgModule, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'vertical-bar-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {
  @Input() dataSource: any[];
  single: any[];

  view: any[] = [575, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {
    // this.single = this.dataSource;
    Object.assign(this, { ...this.single })
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
    this.single = this.dataSource;
  }

  ngAfterViewInit(): void {
    this.single = this.dataSource;
  }
}


@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  declarations: [
    ChartsComponent
  ],
  exports: [
    ChartsComponent
  ]
})
export class ChartsMod { }
import { Component, Input, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService, getUniqueArr, getUniqueValues } from '../../shared';
import { takeUntil } from 'rxjs/operators' ;import { Observable ,  Subject } from 'rxjs';

@Component({
  selector: 'ngx-charts',
  templateUrl: 'ngx-charts.component.html',
  styleUrls: []

})
export class ngxCharts implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  //------------------------------------------------------
  single: any[];
  multi: any[];
  view: any[] = [900,400];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'V.S Value';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#0367D9' ,'#9321af']
  };

  // line, area
  autoScale = true;
  //--------------------------------------------------------------
 
  @Input() data: any[];
  @Input() xAxisCol: string;
  @Input() xAxisIsDate = false;
  @Input() yAxisIsDate = false;
  @Input() yAxisCol: string;
  @Input() seriesCol: string;
  @Input() seriesLabelAr: string;
  @Input() seriesLabelEn: string;

  constructor(public translate: TranslateService) {
    
  }

  ngOnInit() {
    

    this.multi = this.customizeData(this.data, this.xAxisCol, this.yAxisCol, this.seriesCol, this.seriesLabelAr, this.seriesLabelEn, this.xAxisIsDate, this.yAxisIsDate);
    
  }
  ngAfterViewInit() {
    
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }
  //-------------data transformation
  customizeData(data: any[], xAxis: string, yAxis: string, seriesCol: string, seriesLabelAr: string, seriesLabelEn: string, xAxisIsDate: boolean, yAxisIsDate: boolean) {
    
    //--------------------------------------
    var flags = [], l, i, multi = [];
    if (data.length > 0) {
      data.forEach(item => {
        let single = [];
        if (item[yAxis] != (null || undefined) && item[xAxis] != (null || undefined)) {
          if (xAxisIsDate) {
            item[xAxis] = new Date(item[xAxis]);
          }
         
          if (flags[item[seriesCol]]) {
            multi[item[seriesCol]].series.push({ name: item[xAxis], value: item[yAxis] });

          } else {
            flags[item[seriesCol]] = true;
            multi[item[seriesCol]] = { name: item[seriesLabelEn], series: [] };
            multi[item[seriesCol]].series.push({ name: item[xAxis], value: item[yAxis] });
          }
        }
        
      });
    }
    //--------------------------------------
    multi =  multi.filter(xx => xx['series'] != [] );
    return multi;  
  }

  onSelect(event) { }
}



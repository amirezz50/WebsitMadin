import { NgbDate } from './ngb-date';
import { WeekViewModel } from './datepicker-view-model';

 export type MonthViewModel = {
  firstDate: NgbDate,
  number: number,
  year: number,
  weeks: WeekViewModel[],
  weekdays: number[]
};
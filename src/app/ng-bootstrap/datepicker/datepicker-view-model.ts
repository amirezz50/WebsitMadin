import {NgbDate} from './ngb-date';

export type DayViewModel = {
  date: NgbDate,
  disabled: boolean
}

export type WeekViewModel = {
  number: number,
  days: DayViewModel[]
}



export enum NavigationEvent {
  PREV,
  NEXT
}

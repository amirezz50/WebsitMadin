import {Component, Injectable} from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from '../../index';

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS_SHORT = [
    'محرم', 'صفر', 'ربيعʻ اول', 'ربيعʻ ثانى', 'جماد اول', 'جماد ثانى', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة',
    'ذو الحجه'
];
const MONTHS_FULL = [
    'محرم', 'صفر', 'ربيعʻ اول', 'ربيعʻ ثانى', 'جماد اول', 'Jجماد ثانى', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة',
  'ذو الحجه'
];

@Injectable()
export class IslamicCivilI18n extends NgbDatepickerI18n {


  getWeekdayShortName(weekday: number) {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getMonthShortName(month: number) {
    return MONTHS_SHORT[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS_FULL[month - 1];
  }
}
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepicker, NgbDatepickerNavigateEvent } from './datepicker';
import { NgbDatepickerMonthView } from './datepicker-month-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import { NgbInputDatepicker } from './datepicker-input';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerI18n, NgbDatepickerI18nDefault } from './datepicker-i18n';
import { NgbCalendar, NgbCalendarGregorian } from './ngb-calendar';
import { NgbCalendarIslamicCivil } from './hijri/ngb-calendar-islamic-civil';
//import { NgbdDatepickerCalendars } from './hijri/datepicker';
import { NgbDateParserFormatter, NgbDateISOParserFormatter } from './ngb-date-parser-formatter';
import { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
import { NgbDatepickerConfig } from './datepicker-config';

export { NgbDatepicker, NgbDatepickerNavigateEvent } from './datepicker';
export { NgbInputDatepicker } from './datepicker-input';
export { NgbCalendar } from './ngb-calendar';
export { NgbCalendarIslamicCivil } from './hijri/ngb-calendar-islamic-civil';
export { NgbDatepickerMonthView } from './datepicker-month-view';
export { NgbDatepickerDayView } from './datepicker-day-view';
export { NgbDatepickerNavigation } from './datepicker-navigation';
export { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
export { NgbDatepickerConfig } from './datepicker-config';
export { NgbDatepickerI18n } from './datepicker-i18n';
export { NgbDateStruct } from './ngb-date-struct';
export { NgbDateParserFormatter } from './ngb-date-parser-formatter';

@NgModule({
    declarations: [
        NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
        NgbInputDatepicker,
        //NgbdDatepickerCalendars
    ],
    exports: [NgbDatepicker, NgbInputDatepicker],
    imports: [CommonModule, FormsModule],
    entryComponents: [NgbDatepicker]
})
export class NgbDatepickerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgbDatepickerModule,
            providers: [
                { provide: NgbCalendar, useClass: NgbCalendarGregorian },
                { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault },
                { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter }, NgbDatepickerConfig
            ]
        };
    }
}

import { padNumber, toInteger, isNumber } from '../util/util';
import { NgbDateStruct } from './ngb-date-struct';

/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 */
export abstract class NgbDateParserFormatter {
  /**
   * Parses the given value to an NgbDateStruct. Implementations should try their best to provide a result, even
   * partial. They must return null if the value can't be parsed.
   * @param value the value to parse
   */
  abstract parse(value: string): NgbDateStruct;

  /**
   * Formats the given date to a string. Implementations should return an empty string if the given date is null,
   * and try their best to provide a partial result if the given date is incomplete or invalid.
   * @param date the date to format as a string
   */
  abstract format(date: NgbDateStruct): string;
}

export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    let dateParts = []
    if (value && value.indexOf('-') > 0) {
      dateParts = value.trim().split('-');
    }
    if (value && value.indexOf('/') > 0) {
       dateParts = value.trim().split('/');
    }
    if (value && value.length == 8) {
      value = value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4, 4);
       dateParts = value.trim().split('/');
    }

    if (dateParts.length === 1 && isNumber(dateParts[0])) {
      return { year: null, month: null, day: toInteger(dateParts[0]) };
    } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
      return { year: null, month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
    } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
      let  _part0:string = String( dateParts[0]); 
      let  _part2:string = String( dateParts[2]); 
      if (_part0.length == 4)
        return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
      else if (_part2.length == 4)
        return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
        '';
  }
}
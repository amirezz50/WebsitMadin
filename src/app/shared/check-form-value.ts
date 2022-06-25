import { AbstractControl } from '@angular/forms';

let regExp: any = /^[\d\(\)\-+.]+$/m;
let test: any;

export function ValidateInputValue(control: AbstractControl) {
 
    if ((test = regExp.exec(String(control.value))) === null) {
        return { validCardValue: true };
    }
    return null;
}
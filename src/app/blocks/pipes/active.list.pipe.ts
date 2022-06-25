import { Pipe, PipeTransform } from '@angular/core';
export enum Active {
    InActive = 0,
    Active = 1,
    All = 2
}

@Pipe({
    name: 'activeList',
    pure: false
})

export class ActiveListPipe implements PipeTransform {
    transform(value: number, lang: string): any {
        if (lang == undefined) {
            lang = "en";
        }
        if (value) {
            return Active[value] === undefined ? "" : this.getEnumValue(value, lang);
        }
        return "";
    }

    private getEnumValue(active: Active, lang: string): string {
        let matchedValue: string = '';
        matchedValue = Active[active];
        if (lang == 'ar') {
            if (active == Active.All) {
                return "الكل";
            }
            if (active == Active.Active) {
                return "فعال";
            }
            if (active == Active.InActive) {
                return "غير فعال";
            }
        }
        return matchedValue;
    }
}
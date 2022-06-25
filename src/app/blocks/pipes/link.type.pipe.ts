import { Pipe, PipeTransform } from '@angular/core';
import { ComponentType } from '../../modules/component-type';

@Pipe({
    name: 'linkType',
    pure: false
})

export class LinkTypePipe implements PipeTransform {
    transform(value: number, lang: string): any {
        if (!lang) {
            lang = "en";
        }
        if (value) {
            return ComponentType[value] === undefined ? "" : this.getEnumValue(value, lang);
        }
        return "";
    }

    private getEnumValue(linkType: ComponentType, lang: string): string {
        let matchedValue: string = '';
        matchedValue = ComponentType[linkType];
        
        if (lang == 'ar') {

            if (linkType == ComponentType.Program) {
                return "برنامج";
            }
            //if (linkType == ComponentType.Dashboard) {
            //    return "لوحة تحكم";
            //}
            if (linkType == ComponentType.Report) {
                return "تقارير";
            } if (linkType == ComponentType.Favourits) {
                return "مفضلة";
            } if (linkType == ComponentType.Setup) {
                return "اعدادات";
            }
        }
        return matchedValue;
    }
}

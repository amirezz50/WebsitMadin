import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighLightPipe implements PipeTransform {
    transform(text: string, search): string {
        if (search != undefined || search != '') {
            return search ? text.toLowerCase().replace(search.toLowerCase(), (match) =>
                `<mark>${match}</mark>`) : text;
        }
    }
}
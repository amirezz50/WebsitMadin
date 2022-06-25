import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
    name: 'arrayfilter',
    pure: false
})
export class ObjListFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!items || !field || !value ) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item: any) => this.applyFilter(item, field, value ));
    }

    /**
     * Perform the filtering.
     * 
     * @param {_arrayObj}  The array item  to compare to the filter.
     * @param {field}  The property to apply for .
     * @param {value}  The value of field property  .
    
     * @return {boolean} True if _arrayObj satisfies filters, false if not.
     */
    applyFilter(_arrayObj: any, field: string, value: string): boolean {
       
            if (field && value) {
                if (typeof _arrayObj[field] === 'string') {
                    if (_arrayObj[field].toLowerCase().indexOf(value.toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof _arrayObj[field] === 'number') {
                    if (_arrayObj[field] != value) {
                        return false;
                    }
                }
            }
       
        return true;
    }
}


@NgModule({
  declarations: [
    ObjListFilterPipe
  ],
  exports: [
    ObjListFilterPipe
  ]
})

export class ObjListFilterPipeModule{ }
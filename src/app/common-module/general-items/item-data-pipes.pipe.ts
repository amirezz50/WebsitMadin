import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itemDataFilter'
})
export class ItemDataPipe implements PipeTransform {

    transform(items: Array<any>, itemCode: number): Array<any> {
    
        return items.filter(item => item.itemId === itemCode);

    
  }

}

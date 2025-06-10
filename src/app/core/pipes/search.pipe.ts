import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(arrayOfProducts:any , titleOfProduct:string): any[] {
    return arrayOfProducts.filter((item:any)=> item.title.toLowerCase().includes(titleOfProduct.toLowerCase())) ;
  }

}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // call API --> HtppClient 
  private readonly _HttpClient = inject(HttpClient);

  //  Methods 
  getAllProducts():Observable<any> 
  {
    return this._HttpClient.get(`${baseUrl}/api/v1/products`)
  }
  getSpecificProducts(id:string | null):Observable<any> 
  {
    return this._HttpClient.get(`${baseUrl}/api/v1/products/${id}`)
  }

}

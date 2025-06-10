import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl, urlServer } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
 
  private readonly _HtppClient = inject(HttpClient);


  // myHeaders:any ={token : localStorage.getItem("userToken")}


  checkOut(cartId:string|null,shippingDetails:object):Observable<any>{
    return this._HtppClient.post(`${baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${urlServer}`,{
      shippingAddress: shippingDetails
    },
  // {
  //   headers: this.myHeaders
  // }
)
  }
}

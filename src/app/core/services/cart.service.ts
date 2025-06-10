import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Logic Apis => HtppClient
  private readonly _HttpClient = inject(HttpClient);

  // public Property for CountCart
    // cartCount : BehaviorSubject<number>  = new BehaviorSubject(0) ;
  // By using Signals 
  cartCount :WritableSignal<number> = signal(0)

  constructor(){
    effect(()=>{
      localStorage.setItem("cartItems",this.cartCount().toString())
    })
  }

  // property for headers
  // myHeaders: any = { token: localStorage.getItem('userToken') };
  // addProductToCart
  addProductToCart(id: string): Observable<any> {
    return this._HttpClient.post(
      `${baseUrl}/api/v1/cart`,
      {
        productId: id,
      },
      // {
      //   headers: this.myHeaders,
      // }
    );
  }

  //GetProductCart
  getProductCart(): Observable<any> {
    return this._HttpClient.get(`${baseUrl}/api/v1/cart`, 
    //   {
    //   headers: this.myHeaders,
    // }
  );
  }

  // delete Item
  removeSpecificCartItem(id: string): Observable<any> {
    return this._HttpClient.delete(`${baseUrl}/api/v1/cart/${id}`,
    //    {
    //   headers: this.myHeaders,
    // }
  );
  }

  // Update CArt Quantity
  updateCartQuantity(id: string, productCount: number): Observable<any> {
    return this._HttpClient.put(
      `${baseUrl}/api/v1/cart/${id}`,
      {
        count: productCount,
      },
      // {
      //   headers: this.myHeaders,
      // }
    );
  }

  // Clear User CArt
  clearUserCart(): Observable<any> {
    return this._HttpClient.delete(`${baseUrl}/api/v1/cart`, 
    //   {
    //   headers: this.myHeaders,
    // }
  );
  }
}

// Get - delete => URL , Optional headers
// put - post => URL ,Body, Optional headers

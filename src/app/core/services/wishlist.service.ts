import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { baseUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
 private readonly  _HttpClient =  inject(HttpClient)

  addProductToWishlist(id:string):Observable<any>{
    return this._HttpClient.post(`${baseUrl}/api/v1/wishlist`,{
      productId:id
    })
  }

  getProductWishlist():Observable<any>{
    return this._HttpClient.get(`${baseUrl}/api/v1/wishlist`)
  }

  removeProductFromWishlist(id:string):Observable<any>{
    return this._HttpClient.delete(`${baseUrl}/api/v1/wishlist/${id}`)
  }

  isInWishlist(id:string):Observable<boolean> {
    return this.getProductWishlist().pipe(
      map((res:any)=>res.data.some((item:any)=>item.id === id))
    )
  }
}

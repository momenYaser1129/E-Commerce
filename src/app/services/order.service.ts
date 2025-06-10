import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private _HttpClient: HttpClient) { }

  getUserOrders(userId: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/orders/user/${userId}`);
  }
} 
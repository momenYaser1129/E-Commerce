import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  userData: any;

  setRegisterForm(data: object): Observable<any> {
    return this._httpClient.post(`${baseUrl}/api/v1/auth/signup`, data);
  }

  setloginForm(data: object): Observable<any> {
    return this._httpClient.post(`${baseUrl}/api/v1/auth/signin`, data);
  }

  saveUserData(): void {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.userData = jwtDecode(token);
    }
  }

  setToken(token: string): void {
    localStorage.setItem('userToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  logOut(): void {
    localStorage.removeItem('userToken');
    
    this.userData = null;
    this._Router.navigate(['/login']);
  }

  setEmailVerify(data: object): Observable<any> {
    return this._httpClient.post(`${baseUrl}/api/v1/auth/forgotPasswords`, data);
  }
    
  setCodeVerify(data: object): Observable<any> {
    return this._httpClient.post(`${baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  setResetPass(data: object): Observable<any> {
    return this._httpClient.put(`${baseUrl}/api/v1/auth/resetPassword`, data);
  }
}

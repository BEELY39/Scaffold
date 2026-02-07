import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private http: HttpClient) {}

  googleLogin() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  getUserName() {
    return this.http.get(`${environment.apiUrl}/auth/me`);
  }
}

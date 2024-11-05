import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getList(): Observable<any> {
    return this.http.get('../assets/json/appartment-list.json');
  }

  getLoginData(): Observable<any> {
    return this.http.get('../assets/json/login-data.json');
  }
}

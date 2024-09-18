import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from "../models/loginrequest";
import { RegisterModel } from '../models/registermodel';
import { ResetPasswordModel } from '../models/ResetPasswordModel';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  userInfoSubject = new BehaviorSubject<any>(this.getUser());

  constructor(private http:HttpClient, private storage : StorageService){

   }
   login(login:LoginRequest):Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/login',login );

   }
   register(register:RegisterModel):Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/register',register );

  }
  logout(): void {
    this.storage.removeFromStorage('access_token');
    this.storage.removeFromStorage('refresh_token');
    this.storage.removeFromStorage('user_payload');
  }
  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8080/auth/email-exists/${email}`);
  }
   isAuthenticated():boolean {
    const user_payload = this.storage.getFromStorage('user_payload');

    if(user_payload){
      const payload = JSON.parse(user_payload);
      const now = new Date();
      const expirationTime = new Date(payload.exp);
      return now >= expirationTime;

    }
    return  false;


  }
  isLoggin(): Observable<boolean>{
    return this.isAuthenticated$.asObservable();
  }
  verifyEmail(token: string|null): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/auth/verify-account/${token}`);
  }

  forgotPassword(email:string): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/auth/forgot-password`, {email});
  }
  resetPassword(resetPassword:ResetPasswordModel): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/auth/reset-password`, resetPassword);
  }
  refreshToken(): Observable<any> {
    const refresh_token = this.storage.getFromStorage('refresh_token');
    console.log(`Refreshing token: ${refresh_token}`);
    return this.http.post<any>(`http://localhost:8080/auth/refresh-token`, {token:refresh_token});
  }
  getUserSubject(): any{
    return this.userInfoSubject.asObservable();
  }
  getUser(): any{
    const payload = this.storage.getFromStorage('user_payload');
    if(payload){
      const user_payload = JSON.parse(payload);
      return {
        name:user_payload.fullName,
        email: user_payload.email,
        avatarUrl: user_payload.avatarUrl
      };
    }
    else return null;
  }

}

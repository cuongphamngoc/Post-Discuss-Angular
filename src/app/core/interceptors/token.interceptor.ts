import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

 const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: StorageService, private authService: AuthService, private router:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getFromStorage('access_token');
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/signin') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(() => new Error('An Error occur please try again later.'));
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getFromStorage('refresh_token');
      console.log(`Refreshing refresh token ${token}`);
      if (token)
        return this.authService.refreshToken().pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;

            this.tokenService.setToStorage('access_token',res.data.accessToken);
            this.tokenService.setToStorage('refresh_token',res.data.refreshToken);
            this.refreshTokenSubject.next(res.data.accessToken);

            return next.handle(this.addTokenHeader(request, res.data.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authService.logout();
            this.router.navigate(['/login']);
            return throwError(() => new Error('Failed to refresh token. Please login again.'));

          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {

    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });


  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

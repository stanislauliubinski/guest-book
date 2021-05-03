import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  errorMessage: string

  constructor(private alert: AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch(error.status) {
          case 401:
            this.errorMessage = 'Unauthorized. Try to re-login'
            break
          case 422:
            this.errorMessage = 'The given data was invalid'
            break
          case 404:
            this.errorMessage = 'The requested resource does not exist'
            break
          case 429:
            this.errorMessage = 'Too many requests'
            break
        }
        this.alert.failure(this.errorMessage)
        return throwError(error)
      })
    )
  }
}

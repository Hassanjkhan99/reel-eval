import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';
import {Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthenticationService, private notification: NotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url == 'core/register/') {
      return next.handle(request)
    }

    const clone = request.clone({
      withCredentials: true
    })
    return next.handle(clone).pipe(tap(() => {
    }, (error: HttpErrorResponse) => {
      let errorMessage = '';
      let {status} = error;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${status}\nMessage: ${error.message}`;
      }

      if (status == 404) {
        this.notification.error('Error', errorMessage);
      } else if (status == 0) {
        this.notification.warning(
          'warning', 'There might be a problem. Please, try again.'
        );
      } else if (status == 500) {
        this.notification.warning('warning', 'An unexpected error occurred.');
      } else if (status == 403) {
        console.log(error)
        this.notification.error(
          'Error', error.error['details']
        );
      } else if (status == 400 && 'non_field_errors' in error.error) {
        this.notification.warning(
          'Warning',
          error.error['non_field_errors']
        );
      } else if (status == 204) {
        this.notification.error('Error', 'No Data Found');
      }

      return throwError(error);
    },))

  }
}

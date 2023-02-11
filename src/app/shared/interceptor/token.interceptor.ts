import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {NotificationService} from '../services/notification.service';
import {LoadingService} from '../services/loading.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private notification: NotificationService,
    private loadingService: LoadingService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.loading.next(true);
    if (request.url == 'core/register/') {
      return next.handle(request);
    }

    const clone = request.clone({
      withCredentials: true,
    });
    return next.handle(clone).pipe(
      tap(
        () => {
        },
        (error: HttpErrorResponse) => {
          let {status} = error;
          if (status == 404) {
            console.log(request.url);

            if (
              request.url.includes('grade/overall_summary/')
            ) {
              return;
            } else if (
              request.url.includes('grade/grade_by_position_prospect/')
            ) {
              return;
            } else if (!error.error?.['detail']) {
              return error;
            }
            this.notification.error('Error', error.error?.['detail']);
          } else if (status == 0) {
            this.notification.warning(
              'warning',
              'There might be a problem. Please, try again.'
            );
            this.router.navigateByUrl('app/authentication/login');
          } else if (status == 500 &&
            request.url.includes('prospects/import_from_excel/')
          ) {
            return
          } else if (status == 500) {
            this.notification.warning(
              'warning',
              'An unexpected error occurred.'
            );
          } else if (status == 400 && 'non_field_errors' in error.error) {
            this.notification.error('Error', error.error['non_field_errors']);
          } else if (status == 204) {
            this.notification.warning('Warning', 'No Data Found');
          }
          this.loadingService.loading.next(false);

          return throwError(error);
        }
      )
    );
  }
}

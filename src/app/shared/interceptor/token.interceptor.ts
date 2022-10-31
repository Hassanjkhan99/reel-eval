import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';
import {Router} from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const clone = request.clone({
      withCredentials: true
    })
    // @ts-ignore
    return next.handle(clone).pipe(catchError((err: HttpErrorResponse) => {

      return err
    }))

  }
}

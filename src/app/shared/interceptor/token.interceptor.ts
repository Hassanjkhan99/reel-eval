import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthenticationService, private notification: NzNotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const clone = request.clone({
      withCredentials: true
    })
    return next.handle(clone)

  }
}

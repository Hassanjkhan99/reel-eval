import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import {main_url} from "../../../environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if (request.url.replace(main_url, '').includes('dj-rest-auth/login/' || 'core/register/')) {
        return next.handle(request);
      } else {
        const clone = request.clone({
          withCredentials: true
        })
        return next.handle(clone);
      }

    }
}

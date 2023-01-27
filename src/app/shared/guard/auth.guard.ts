import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // @ts-ignore
    return this.checkUser()
  }

  checkUser() {
    return this.authService.checkLogin().pipe(tap(e => {
      localStorage.setItem('user', JSON.stringify(e))
      this.authService.currentUser$.next(e)
      return !!e;
    }, error => !error))
  }
}

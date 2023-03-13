import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {tap} from 'rxjs/operators';
import {NotificationService} from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {
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
    return this.checkUser();
  }

  checkUser() {
    return this.authService.checkLogin().pipe(
      tap(
        (e) => {
          localStorage.setItem('user', JSON.stringify(e));
          if (e.club_is_active) {
            this.authService.currentUser$.next(e);
            return !!e;
          } else {
            this.authService.logout().subscribe((e) => {
              this.router.navigateByUrl(`authentication/login`);
              this.notificationService.error(
                'Error',
                'Your club is currently inactive. Please contact support@reeleval.com for assistance.',
                'bottomRight',
                true,
                20000
              );
            });
          }
          return false;
        },
        (error) => !error
      )
    );
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Login, SignUp, UserMe} from '../interfaces/authentication.interface';
import {main_url} from '../../../environments/environment';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser$: BehaviorSubject<UserMe> = new BehaviorSubject<UserMe>(null)

  constructor(
    private http: HttpClient,
    public loadingService: LoadingService
  ) {
  }

  logout(): Observable<{ detail: string }> {
    return this.http
      .post<{ detail: string }>(`${main_url}dj-rest-auth/logout/`, {})
      .pipe(
        tap((val) => {
          this.loadingService.loading.next(false);
        })
      );
  }

  signup(payload: SignUp): Observable<SignUp> {
    return this.http.post<SignUp>(`${main_url}core/register/`, payload).pipe(
      tap((val) => {
        this.loadingService.loading.next(false);
      })
    );
  }

  login(payload: Login): Observable<Login> {
    return this.http
      .post<Login>(`${main_url}dj-rest-auth/login/`, payload)
      .pipe(
        tap((val) => {
          this.loadingService.loading.next(false);
        })
      );
  }

  checkLogin(): Observable<UserMe> {
    return this.http.get<UserMe>(`${main_url}accounts/me/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }


  forget(email): Observable<string> {
    return this.http
      .post<string>(`${main_url}dj-rest-auth/password/reset/`, {email})
      .pipe(
        tap((val) => {
          this.loadingService.loading.next(false);
        })
      );
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {Login, SignUp} from '../interfaces/authentication.interface';
import {main_url} from '../../../environments/environment';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // currentUser$: BehaviorSubject<UserMe> = new BehaviorSubject<UserMe>(null)
  currentUser$: BehaviorSubject<{
    reel_eval_admin: boolean;
    club_is_active: boolean;
    club_id: number;
    reel_eval_customer: boolean;
    last_name: string;
    groups: number[];
    id: number;
    club_name: string;
    first_name: string;
    email: string;
    username: string;
    group: string;
  }> = new BehaviorSubject<{
    reel_eval_admin: boolean;
    club_is_active: boolean;
    club_id: number;
    reel_eval_customer: boolean;
    last_name: string;
    groups: number[];
    id: number;
    club_name: string;
    first_name: string;
    email: string;
    username: string;
    group: string;
  }>(null);

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

  // checkLogin(): Observable<UserMe> {
  //   return this.http.get<UserMe>(`${main_url}accounts/me/`).pipe(tap((val) => {
  //     this.loadingService.loading.next(false)
  //   }));
  // }

  checkLogin(): Observable<{
    reel_eval_admin: boolean;
    club_is_active: boolean;
    club_id: number;
    reel_eval_customer: boolean;
    last_name: string;
    groups: number[];
    id: number;
    club_name: string;
    first_name: string;
    email: string;
    username: string;
    group: string;
  }> {
    return of({
      id: 85,
      username: 'reeleval',
      email: 'reeleval@yahoo.com',
      first_name: 'Reel',
      last_name: 'Eval',
      club_id: 59,
      club_name: 'Reel Analytics',
      club_is_active: true,
      reel_eval_customer: false,
      reel_eval_admin: true,
      group: 'Club Admin',
      groups: [2],
    });
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

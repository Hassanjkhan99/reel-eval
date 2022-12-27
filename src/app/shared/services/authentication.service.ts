import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Login, SignUp, UserMe} from '../interfaces/authentication.interface';
import {main_url} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  currentUser$: BehaviorSubject<UserMe> = new BehaviorSubject<UserMe>(null)

  constructor(private http: HttpClient) {
  }

  logout(): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(
      `${main_url}dj-rest-auth/logout/`,
      {}
    );
  }

  signup(payload: SignUp): Observable<SignUp> {
    return this.http.post<SignUp>(`${main_url}core/register/`, payload);
  }

  login(payload: Login): Observable<Login> {
    return this.http.post<Login>(`${main_url}dj-rest-auth/login/`, payload);
  }

  checkLogin(): Observable<UserMe> {
    return this.http.get<UserMe>(`${main_url}accounts/me/`);
  }

  forget(email): Observable<string> {
    return this.http.post<string>(
      `${main_url}dj-rest-auth/password/reset/`,
      {email}
    );
  }
}

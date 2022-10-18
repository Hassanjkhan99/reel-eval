import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../interfaces/user.type';
import {Login, SignUp} from "../interfaces/authentication.interface";
import {main_url} from "../../../environments/environment";
import {ServerResponse} from "http";

const USER_AUTH_API_URL = '/api-url';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header,
        withCredentials: true,
         observe: 'response' as 'response'
      };
        return this.http.post<any>(USER_AUTH_API_URL, { username, password },httpOptions)

    }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  postSignup(payload: SignUp): Observable<SignUp> {
    return this.http.post<SignUp>(`${main_url}core/register/`, payload);
  }

  proceedLogin(payload: Login): Observable<HttpResponse<Login>> {

    return this.http.post<Login>(`${main_url}dj-rest-auth/login/`, payload, { observe: 'response' as 'response' ,  withCredentials: true});
  }
}


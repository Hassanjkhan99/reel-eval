import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUp} from "../interfaces/authentication.interface";
import {Observable} from "rxjs";
import {main_url} from "../../../environments/environment";
import {Staff} from "../interfaces/staff.interface";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) {
  }

  postAddCoach(payload: Staff): Observable<Staff> {
    return this.http.post<Staff>(`${main_url}core/register/`, payload);
  }
}

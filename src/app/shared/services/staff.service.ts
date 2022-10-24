import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignUp} from "../interfaces/authentication.interface";
import {Observable} from "rxjs";
import {main_url} from "../../../environments/environment";
import {Staff, StaffList} from "../interfaces/staff.interface";
import {Prospect} from "../interfaces/prospect.interface";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) {
  }

  postAddCoach(payload: Staff): Observable<Staff> {
    return this.http.post<Staff>(`${main_url}core/register/`, payload);
  }

  getStaff(): Observable<StaffList> {
    return this.http.get<StaffList>(`${main_url}accounts/`);
  }
}

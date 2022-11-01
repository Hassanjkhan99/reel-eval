import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {main_url} from "../../../environments/environment";
import {Staff, StaffApi} from "../interfaces/staff.interface";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) {
  }

  postAddCoach(payload: Staff): Observable<Staff> {
    return this.http.post<Staff>(`${main_url}core/register/create_user_with_club/`, payload);
  }

  getStaff(): Observable<StaffApi> {
    return this.http.get<StaffApi>(`${main_url}accounts/`);
  }
}

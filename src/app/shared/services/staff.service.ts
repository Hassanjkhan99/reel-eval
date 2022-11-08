import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {main_url} from "../../../environments/environment";
import {Group, GroupList, Staff, StaffApi, StaffList} from "../interfaces/staff.interface";
import {map} from "rxjs/operators";

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

  getStaffSorted(column: string, direction: string): Observable<StaffApi> {
    return this.http.get<StaffApi>(`${main_url}accounts/`, {params: {ordering: column}});
  }

  getGroupList(): Observable<GroupList[]> {
    return this.http.get<Group>(`${main_url}groups/`).pipe(map(e => e.results));
  }

  editStaff(id: number, payload: Partial<Staff>): Observable<StaffList> {
    return this.http.put<StaffList>(`${main_url}accounts/${id}/`, payload);
  }


  deleteStaff(id: number): Observable<Staff> {
    return this.http.delete<Staff>(`${main_url}accounts/${id}/`);
  }


}

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

  getStaff(pageIndex, pageSize, sortField?, sortOrder?, filter?, filterField?: string): Observable<StaffApi> {
    if (sortOrder && sortField) {
      sortField = sortField.toLowerCase()
      sortField = sortOrder === 'descend' ? '-' + sortField : sortField
    }

    let params = {}
    if (pageIndex) {
      params['pageIndex'] = pageIndex
    }
    if (pageSize) {
      params['pageSize'] = pageSize
    }
    if (sortField) {
      params['ordering'] = sortField
    }

    if (filter && filterField) {
      params[filterField + '__icontains'] = filter
    }
    return this.http.get<StaffApi>(`${main_url}accounts/`, {params});
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

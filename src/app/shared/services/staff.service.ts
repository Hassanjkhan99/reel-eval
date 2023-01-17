import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {main_url} from "../../../environments/environment";
import {ChangePass, Group, GroupList, Staff, StaffApi, StaffList} from "../interfaces/staff.interface";
import {map} from "rxjs/operators";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, public loadingService: LoadingService
  ) {
  }

  postAddCoach(payload: Staff): Observable<Staff> {
    return this.http.post<Staff>(`${main_url}core/register/create_user_with_club/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getStaff(pageIndex, pageSize, sortField?, sortOrder?, filter?, filterField?: string): Observable<StaffApi> {
    if (sortOrder && sortField) {
      sortField = sortField.toLowerCase()
      sortField = sortOrder === 'descend' ? '-' + sortField : sortField
    }

    let params = {}
    if (pageIndex) {
      params['offset'] = (pageIndex - 1) * pageSize
    }
    if (pageSize) {
      params['limit'] = pageSize
    }
    if (sortField) {
      params['ordering'] = sortField
    }

    if (filter && filterField) {
      params[filterField + '__icontains'] = filter
    }
    return this.http.get<StaffApi>(`${main_url}accounts/`, {params}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getStaffSorted(column: string, direction: string): Observable<StaffApi> {
    return this.http.get<StaffApi>(`${main_url}accounts/`, {params: {ordering: column}}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getGroupList(): Observable<GroupList[]> {
    return this.http.get<Group>(`${main_url}groups/`).pipe(map(e => e.results)).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  editStaff(id: number, payload: Partial<Staff>): Observable<StaffList> {
    return this.http.put<StaffList>(`${main_url}accounts/${id}/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }


  deleteStaff(id: number): Observable<Staff> {
    return this.http.delete<Staff>(`${main_url}accounts/${id}/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  changePassword(id: number, payload: ChangePass): Observable<ChangePass> {
    return this.http.post<ChangePass>(`${main_url}accounts/${id}/change_password/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }


}

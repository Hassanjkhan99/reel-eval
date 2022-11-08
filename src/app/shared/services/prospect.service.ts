import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Prospect, ProspectApi} from "../interfaces/prospect.interface";
import {main_url} from "../../../environments/environment";
import {Positions, Result} from "../interfaces/positions.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor(private http: HttpClient) {
  }

  getProspects(pageIndex, pageSize, sortField?, sortOrder?, filter?, filterField?: string): Observable<ProspectApi> {
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
    return this.http.get<ProspectApi>(`${main_url}prospects/`, {params});
  }

  getArchivedProspects(pageIndex, pageSize, sortField?, sortOrder?, filter?, filterField?: string): Observable<ProspectApi> {
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
    return this.http.get<ProspectApi>(`${main_url}archived_prospects/`, {params});
  }

  editProspect(id: number, payload: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(`${main_url}prospects/${id}/`, payload);
  }

  unArchiveProspect(id: number): Observable<Prospect> {
    return this.http.patch<Prospect>(`${main_url}archived_prospects/${id}/`, {});
  }

  postAddProspect(payload: Partial<Prospect>): Observable<Prospect> {
    return this.http.post<Prospect>(`${main_url}prospects/`, payload);
  }

  deleteProspect(id: number): Observable<Prospect> {
    return this.http.delete<Prospect>(`${main_url}prospects/${id}/`);
  }


  getPositions(): Observable<Positions[]> {
    return this.http.get<Result>(`${main_url}positions/`).pipe(map(e => e.results));
  }
}

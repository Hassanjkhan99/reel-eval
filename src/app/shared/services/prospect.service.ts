import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Prospect, ProspectApi, ProspectForm} from "../interfaces/prospect.interface";
import {main_url} from "../../../environments/environment";
import {Positions, Result} from "../interfaces/positions.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor(private http: HttpClient) {
  }

  getProspects(): Observable<Prospect[]> {
    return this.http.get<ProspectApi>(`${main_url}prospects/`).pipe(map(e => e.results));
  }

  getArchivedProspects(): Observable<Prospect[]> {
    return this.http.get<ProspectApi>(`${main_url}archived_prospects/`).pipe(map(e => e.results));
  }

  editProspect(id: number, payload: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(`${main_url}prospects/${id}/`, payload);
  }

  unArchiveProspect(id: number): Observable<Prospect> {
    return this.http.patch<Prospect>(`${main_url}archived_prospects/${id}/`, {});
  }

  postAddProspect(payload: ProspectForm): Observable<ProspectForm> {
    return this.http.post<ProspectForm>(`${main_url}prospects/`, payload);
  }

  deleteProspect(id: number): Observable<Prospect> {
    return this.http.delete<Prospect>(`${main_url}prospects/${id}/`);
  }


  getPositions(): Observable<Positions[]> {
    return this.http.get<Result>(`${main_url}positions/`).pipe(map(e => e.results));
  }
}

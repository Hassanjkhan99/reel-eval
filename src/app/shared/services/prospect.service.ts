import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Prospect, ProspectForm} from "../interfaces/prospect.interface";
import {main_url} from "../../../environments/environment";
import {Positions} from "../interfaces/positions.interface";

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor(private http: HttpClient) {
  }

  getProspects(): Observable<Prospect> {
    return this.http.get<Prospect>(`${main_url}prospects/`);
  }

  editProspect(id: number, payload): Observable<Prospect> {
    return this.http.put<Prospect>(`${main_url}prospects/${id}/`, payload);
  }

  postAddProspect(payload: ProspectForm): Observable<ProspectForm> {
    return this.http.post<ProspectForm>(`${main_url}prospects/`, payload);
  }

  getPositions(): Observable<Positions> {
    return this.http.get<Positions>(`${main_url}positions/`);
  }
}

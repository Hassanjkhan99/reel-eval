import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Prospect} from "../interfaces/prospect.interface";
import {main_url} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor(private http: HttpClient) {
  }

  getProspects(): Observable<Prospect> {
    return this.http.get<Prospect>(`${main_url}prospects/`);
  }
}

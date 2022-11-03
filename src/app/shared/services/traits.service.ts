import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {main_url} from "../../../environments/environment";
import {Trait, TraitsApiResponse} from "../interfaces/trait";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TraitsService {

  constructor(private http: HttpClient) {
  }

  getAllTraits(): Observable<Trait[]> {
    return this.http.get<TraitsApiResponse>(main_url + 'traits/').pipe(map(e => e.results))
  }

  saveTrait(payload: Partial<Trait>) {
    return this.http.post(main_url + 'traits/', payload)
  }

  editTrait(id: number, payload: Partial<Trait>): Observable<Trait> {
    return this.http.put<Trait>(`${main_url}traits/${id}/`, payload);
  }

  deleteTrait(id: number): Observable<Trait> {
    return this.http.delete<Trait>(`${main_url}traits/${id}/`);
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {main_url} from "../../../environments/environment";
import {Traits, TraitsApiResponse} from "../interfaces/traits";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TraitsService {

  constructor(private http: HttpClient) {
  }

  getAllTraits(): Observable<Traits[]> {
    return this.http.get<TraitsApiResponse>(main_url + 'traits/').pipe(map(e => e.results))
  }
}

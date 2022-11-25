import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {main_url} from "../../../environments/environment";
import {Trait, TraitsApiResponse} from "../interfaces/trait";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TraitsService {

  constructor(private http: HttpClient) {
  }

  getAllTraits(pageIndex, pageSize, sortField?, sortOrder?, filter?, filterField?: string): Observable<TraitsApiResponse> {
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
    return this.http.get<TraitsApiResponse>(main_url + 'traits/', {params})
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

  getTraitsSearch(searchValue?: string): Observable<Trait[]> {
    return this.http.get<TraitsApiResponse>(`${main_url}traits/`, {
      params: {
        'trait__icontains': searchValue
      }
    }).pipe(map(e => e.results));
  }


}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {main_url} from '../../../environments/environment';
import {GetTraitByPosApi, PostTraitsByPosition, Trait, TraitByPos, TraitsApiResponse,} from '../interfaces/trait';
import {Observable, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class TraitsService {
  traitsArr: number[] = [];

  constructor(
    private http: HttpClient,
    public loadingService: LoadingService
  ) {
  }

  getAllTraits(
    pageIndex,
    pageSize,
    sortField?,
    sortOrder?,
    filter?,
    filterField?: string
  ): Observable<TraitsApiResponse> {
    if (sortOrder && sortField) {
      sortField = sortField.toLowerCase();
      sortField = sortOrder === 'descend' ? '-' + sortField : sortField;
    }

    let params = {};
    if (pageIndex) {
      params['offset'] = (pageIndex - 1) * pageSize;
    }
    if (pageSize) {
      params['limit'] = pageSize;
    }
    if (sortField) {
      params['ordering'] = sortField;
    }

    if (filter && filterField) {
      params[filterField + '__icontains'] = filter;
    }
    return this.http.get<TraitsApiResponse>(main_url + 'traits/', {params}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  saveTrait(payload: Partial<Trait>) {
    return this.http.post(main_url + 'traits/', payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  editTrait(id: number, payload: Partial<Trait>): Observable<Trait> {
    return this.http.put<Trait>(`${main_url}traits/${id}/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  deleteTrait(id: number): Observable<Trait> {
    return this.http.delete<Trait>(`${main_url}traits/${id}/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getTraitsSearch(searchValue?: string): Observable<Trait[]> {
    return this.http
      .get<TraitsApiResponse>(`${main_url}traits/`, {
        params: {
          trait__icontains: searchValue,
        },
      })
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  postTraitByPosition(
    payload: PostTraitsByPosition
  ): Observable<PostTraitsByPosition> {
    return this.http.post<PostTraitsByPosition>(
      `${main_url}position_traits/`,
      payload
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getTraitByPosition(id: number): Observable<TraitByPos[]> {
    return this.http
      .get<GetTraitByPosApi>(`${main_url}position_traits/`, {
        params: {
          position__id: id,
        },
      })
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  editTraitByPosition(
    payload: PostTraitsByPosition
  ): Observable<PostTraitsByPosition> {
    return this.http.put<PostTraitsByPosition>(
      `${main_url}position_traits/update_position_trait/`,
      payload
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  deleteTraitByPosition(
    posId: number,
    traitId: number
  ): Observable<PostTraitsByPosition> {
    return this.http.delete<PostTraitsByPosition>(
      `${main_url}position_traits/delete_position_trait/${posId}/${traitId}/`
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }
}

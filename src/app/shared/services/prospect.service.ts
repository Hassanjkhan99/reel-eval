import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Prospect, ProspectApi} from '../interfaces/prospect.interface';
import {main_url} from '../../../environments/environment';
import {Position, Result, SobPosition, SobPositionApi,} from '../interfaces/positions.interface';
import {map} from 'rxjs/operators';
import {SchoolApi, Schools} from '../interfaces/school.interface';
import {StateApi, States} from '../interfaces/state.interface';
import {LoadingService} from './loading.service';
import {DownloadFormApi} from "../interfaces/download-form";

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  constructor(
    private http: HttpClient,
    public loadingService: LoadingService
  ) {
  }


  getProspects(
    pageIndex,
    pageSize,
    sortField?,
    sortOrder?,
    filter?,
    filterField?: string
  ): Observable<ProspectApi> {
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
    return this.http.get<ProspectApi>(`${main_url}prospects/`, {params}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  getArchivedProspects(
    pageIndex,
    pageSize,
    sortField?,
    sortOrder?,
    filter?,
    filterField?: string
  ): Observable<ProspectApi> {
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
    return this.http.get<ProspectApi>(`${main_url}archived_prospects/`, {
      params,
    }).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  editProspect(id: number, payload: Prospect): Observable<Prospect> {
    return this.http.put<Prospect>(`${main_url}prospects/${id}/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  editArchivedProspect(id: number, payload: Prospect): Observable<Prospect> {
    return this.http.patch<Prospect>(`${main_url}archived_prospects/${id}/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  unArchiveProspect(id: number): Observable<Prospect> {
    return this.http.patch<Prospect>(
      `${main_url}archived_prospects/${id}/`,
      {}
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  postAddProspect(payload: Partial<Prospect>): Observable<Prospect> {
    return this.http.post<Prospect>(`${main_url}prospects/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  deleteProspect(id: number): Observable<Prospect> {
    return this.http.delete<Prospect>(`${main_url}prospects/${id}/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  deleteArchiveProspect(id: number): Observable<Prospect> {
    return this.http.delete<Prospect>(`${main_url}archived_prospects/${id}/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  getPositions(): Observable<Position[]> {
    return this.http
      .get<Result>(`${main_url}positions/`)
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  getSobPositions(): Observable<SobPositionApi[]> {
    return this.http
      .get<SobPosition>(`${main_url}positions/`)
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  getSchools(searchValue?: string): Observable<Schools[]> {
    return this.http
      .get<SchoolApi>(`${main_url}schools/`, {
        params: {
          school_name__icontains: searchValue,
        },
      })
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  getStates(searchValue?: string): Observable<States[]> {
    return this.http
      .get<StateApi>(`${main_url}states/`, {
        params: {
          state_name__icontains: searchValue,
        },
      })
      .pipe(map((e) => e.results)).pipe(tap((val) => {
        this.loadingService.loading.next(false)
      }));
  }

  exportCompleteListToExcel(achievedTable: boolean) {
    return this.http.get(
      `${main_url}${
        achievedTable ? 'archived_prospects' : 'prospects'
      }/export_to_excel/0/`,
      {responseType: 'blob' as 'json'}
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  exportToExcel(achievedTable: boolean, idArr: number[]) {
    return this.http.get(
      `${main_url}${
        achievedTable ? 'archived_prospects' : 'prospects'
      }/export_to_excel/${idArr.join(',')}/`,
      {responseType: 'blob' as 'json'}
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  uploadProspectList(file): Observable<any> {
    let formData = new FormData();
    formData.append("myfile", file);

    return this.http.post(main_url + 'prospects/import_from_excel/', formData).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  downloadProspectListForm(): Observable<DownloadFormApi> {
    return this.http.get<DownloadFormApi>(
      main_url + `download_form/`,
    ).pipe(tap((val) => {
      this.loadingService.loading.next(false)
      return val.results
    }))
  }
}

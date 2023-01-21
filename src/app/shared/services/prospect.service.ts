import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {Prospect, ProspectApi} from '../interfaces/prospect.interface';
import {main_url} from '../../../environments/environment';
import {Position, Result, SobPosition, SobPositionApi,} from '../interfaces/positions.interface';
import {map} from 'rxjs/operators';
import {SchoolApi, Schools} from '../interfaces/school.interface';
import {StateApi, States} from '../interfaces/state.interface';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  constructor(
    private http: HttpClient,
    public loadingService: LoadingService
  ) {
  }

  prospects = {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": 105,
        "first_name": "jamil",
        "last_name": "khaan",
        "position": [
          8,
          3,
          4,
          6
        ],
        "pos": [
          {
            "id": 8,
            "position_name": "Inside Backer",
            "abbreviation": "ILB"
          },
          {
            "id": 3,
            "position_name": "Cornerback",
            "abbreviation": "CB"
          },
          {
            "id": 4,
            "position_name": "Defensive End",
            "abbreviation": "DE"
          },
          {
            "id": 6,
            "position_name": "Fullback",
            "abbreviation": "FB"
          }
        ],
        "classification": "2015",
        "state": "Arizona",
        "school": "Abbotsford High School",
        "video_link": "",
        "club": 6,
        "user": 8,
        "archived": false,
        "unique_id": "universityofmichigan-jamilkhaan2015arizonaabbotsfordhighschool",
        "unique_id_without_club": "jamilkhaan2015arizonaabbotsfordhighschool",
        "prospect_score": [
          {
            "id": 6,
            "position_name": "Ath",
            "score": 77.0
          }, {
            "id": 6,
            "position_name": "QTR",
            "score": 67.0
          }, {
            "id": 6,
            "position_name": "ABC",
            "score": 57.0
          }, {
            "id": 6,
            "position_name": "DEF",
            "score": 47.0
          },
        ],
        "iga_score": null,
        "created": "12-12-2022 18:23:54",
        "modified": "01-19-2023 08:06:24"
      },
      {
        "id": 96,
        "first_name": "kk",
        "last_name": "kk",
        "position": [
          2,
          3,
          4,
          5
        ],
        "pos": [
          {
            "id": 2,
            "position_name": "Center",
            "abbreviation": "OC"
          },
          {
            "id": 3,
            "position_name": "Cornerback",
            "abbreviation": "CB"
          },
          {
            "id": 4,
            "position_name": "Defensive End",
            "abbreviation": "DE"
          },
          {
            "id": 5,
            "position_name": "Defensive Tackle",
            "abbreviation": "DT"
          }
        ],
        "classification": "2011",
        "state": "Alaska",
        "school": "Abbeville Christian Academy",
        "video_link": "",
        "club": 6,
        "user": 8,
        "archived": false,
        "unique_id": "universityofmichigan-kkkk2011alaskaabbevillechristianacademy",
        "unique_id_without_club": "kkkk2011alaskaabbevillechristianacademy",
        "prospect_score": [
          {
            "id": 6,
            "position_name": "Ath",
            "score": 77.0
          }, {
            "id": 6,
            "position_name": "QTR",
            "score": 67.0
          }, {
            "id": 6,
            "position_name": "ABC",
            "score": 57.0
          }, {
            "id": 6,
            "position_name": "DEF",
            "score": 47.0
          },
        ],
        "iga_score": null,
        "created": "12-08-2022 20:21:20",
        "modified": "01-19-2023 08:07:25"
      },
      {
        "id": 76,
        "first_name": "hassan",
        "last_name": "jamil",
        "position": [
          2,
          3,
          4
        ],
        "pos": [
          {
            "id": 2,
            "position_name": "Center",
            "abbreviation": "OC"
          },
          {
            "id": 3,
            "position_name": "Cornerback",
            "abbreviation": "CB"
          },
          {
            "id": 4,
            "position_name": "Defensive End",
            "abbreviation": "DE"
          }
        ],
        "classification": "2022",
        "state": "Saskatchewan",
        "school": "Wright High School",
        "video_link": null,
        "club": 6,
        "user": 8,
        "archived": false,
        "unique_id": "universityofmichigan-hassanjamil2022saskatchewanwrighthighschool",
        "unique_id_without_club": "hassanjamil2022saskatchewanwrighthighschool",
        "prospect_score": [
          {
            "id": 6,
            "position_name": "Ath",
            "score": 77.0
          }, {
            "id": 6,
            "position_name": "QTR",
            "score": 67.0
          }, {
            "id": 6,
            "position_name": "ABC",
            "score": 57.0
          }, {
            "id": 6,
            "position_name": "DEF",
            "score": 47.0
          },
        ],
        "iga_score": null,
        "created": "11-04-2022 17:38:51",
        "modified": "01-19-2023 08:07:18"
      },
      {
        "id": 42,
        "first_name": "Johnn",
        "last_name": "Smithh",
        "position": [
          2,
          3,
          1
        ],
        "pos": [
          {
            "id": 2,
            "position_name": "Center",
            "abbreviation": "OC"
          },
          {
            "id": 3,
            "position_name": "Cornerback",
            "abbreviation": "CB"
          },
          {
            "id": 1,
            "position_name": "Athlete",
            "abbreviation": "ATH"
          }
        ],
        "classification": "2022",
        "state": "TX",
        "school": "high school arkansas",
        "video_link": "",
        "club": 6,
        "user": 8,
        "archived": false,
        "unique_id": "universityofmichigan-johnnsmithh2022txhighschoolarkansas",
        "unique_id_without_club": "johnnsmithh2022txhighschoolarkansas",
        "prospect_score": [
          {
            "id": 6,
            "position_name": "Ath",
            "score": 77.0
          }, {
            "id": 6,
            "position_name": "QTR",
            "score": 67.0
          }, {
            "id": 6,
            "position_name": "ABC",
            "score": 57.0
          }, {
            "id": 6,
            "position_name": "DEF",
            "score": 47.0
          },
        ],
        "iga_score": null,
        "created": "10-27-2022 15:57:28",
        "modified": "01-19-2023 08:07:21"
      }
    ]
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
    // return this.http.get<ProspectApi>(`${main_url}prospects/`, {params}).pipe(tap((val) => {
    //   this.loadingService.loading.next(false)
    // }))
    this.loadingService.loading.next(false)
    return of(this.prospects)
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
}

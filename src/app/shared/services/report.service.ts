import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Report, Result} from '../interfaces/report';
import {main_url} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {BarReport, BarReportApi} from '../interfaces/bar-report';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {
  }

  getReportData(): Observable<Result[]> {
    return this.http
      .get<Report>(`${main_url}trajectory_report/`)
      .pipe(map((e) => e.results));
  }

  getBarReportData(
    positionId: number,
    prospectId: number
  ): Observable<BarReport> {
    return this.http
      .get<BarReportApi>(
        `${main_url}prospect_report/?position__id=${positionId}&prospect__id=${prospectId}`
      )
      .pipe(map((e) => e.results[0]));
  }
}

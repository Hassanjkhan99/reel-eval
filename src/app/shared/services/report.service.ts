import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Report, Result} from "../interfaces/report";
import {main_url} from "../../../environments/environment";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ReportService {


  constructor(private http: HttpClient) {
  }

  getReportData(): Observable<Result[]> {
    return this.http.get<Report>(`${main_url}trajectory_report/`).pipe(map(e => e.results
      )
    )
  }
}

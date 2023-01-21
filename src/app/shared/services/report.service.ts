import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Result} from "../interfaces/report";


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  report = {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "prospect": {
          "id": 105,
          "first_name": "jamil",
          "last_name": "khaan",
          "classification": "2015",
          "state": "Arizona",
          "school": "Abbotsford High School",
          "user": 8
        },
        "position": {
          "id": 1,
          "position_name": "Athlete",
          "abbreviation": "ATH"
        },
        "score": 77.0,
        "iga_score": null
      },
      {
        "prospect": {
          "id": 42,
          "first_name": "Johnn",
          "last_name": "Smithh",
          "classification": "2022",
          "state": "TX",
          "school": "high school arkansas",
          "user": 8
        },
        "position": {
          "id": 2,
          "position_name": "Center",
          "abbreviation": "OC"
        },
        "score": 71.67,
        "iga_score": null
      },
      {
        "prospect": {
          "id": 96,
          "first_name": "kk",
          "last_name": "kk",
          "classification": "2011",
          "state": "Alaska",
          "school": "Abbeville Christian Academy",
          "user": 8
        },
        "position": {
          "id": 1,
          "position_name": "Athlete",
          "abbreviation": "ATH"
        },
        "score": 63.63,
        "iga_score": 92.2
      },
      {
        "prospect": {
          "id": 76,
          "first_name": "hassan",
          "last_name": "jamil",
          "classification": "2022",
          "state": "Saskatchewan",
          "school": "Wright High School",
          "user": 8
        },
        "position": {
          "id": 1,
          "position_name": "Athlete",
          "abbreviation": "ATH"
        },
        "score": 60.1,
        "iga_score": null
      }
    ]
  }

  constructor(private http: HttpClient) {
  }

  getReportData(): Observable<Result[]> {
    return of(this.report.results)
    // return this.http.get<Report>(`${main_url}trajectory_report/`).pipe(map(e => e.results
    //   )
    // )
  }
}

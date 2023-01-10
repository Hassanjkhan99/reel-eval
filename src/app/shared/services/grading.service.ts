import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {main_url} from "../../../environments/environment";
import {Grading} from "../interfaces/grading";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradingService {

  constructor(private http: HttpClient) {
  }

  getPlays(positionId: number, prospectId: number): Observable<Grading> {
    return this.http.get<Grading>(main_url + 'grade/grade_by_position_prospect/' + positionId + '/' + prospectId)
  }
}

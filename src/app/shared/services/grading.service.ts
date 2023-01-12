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

  deletePlays(playId: number): Observable<Grading> {
    return this.http.delete<Grading>(main_url + 'play/' + playId + '/')
  }

  createNewPlay(positionId: number, prospectId: number): Observable<Grading> {
    return this.http.get<Grading>(main_url + 'grade/grade_next_play/' + positionId + '/' + prospectId)
  }

  incrementScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: 1
    })
  }

  decrementScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: 0
    })
  }

  neutralScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: null
    })
  }


}

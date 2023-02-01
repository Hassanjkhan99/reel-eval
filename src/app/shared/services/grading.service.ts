import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {main_url} from "../../../environments/environment";
import {GradeSummary, Grading} from "../interfaces/grading";
import {Observable, tap} from "rxjs";
import {Position, Prospect} from "../interfaces/prospect.interface";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class GradingService {
  selectedPosition: Position = null;
  selectedProspect: Prospect = null;

  constructor(private http: HttpClient, public loadingService: LoadingService) {
  }

  getPlays(positionId: number, prospectId: number): Observable<Grading> {
    return this.http.get<Grading>(main_url + 'grade/grade_by_position_prospect/' + positionId + '/' + prospectId + '/').pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  deletePlays(playId: number): Observable<Grading> {
    return this.http.delete<Grading>(main_url + 'play/' + playId + '/').pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  createNewPlay(positionId: number, prospectId: number): Observable<Grading> {
    return this.http.get<Grading>(main_url + 'grade/grade_next_play/' + positionId + '/' + prospectId + '/').pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  incrementScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: 1
    }).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  decrementScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: 0
    }).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  neutralScore(id: number): Observable<Grading> {
    return this.http.patch<Grading>(main_url + 'grade/' + id + '/', {
      score: null
    }).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  clearPlay(playId: number): Observable<Grading> {
    return this.http.get<Grading>(main_url + 'play/clear_play/' + playId + '/').pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  getGradeSummary(positionId: number, prospectId: number): Observable<GradeSummary> {
    return this.http.get<GradeSummary>(main_url + 'grade/overall_summary/' + positionId + '/' + prospectId + '/').pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

  editGradeSummary(positionId: number, prospectId: number, payload: string): Observable<GradeSummary> {
    return this.http.patch<GradeSummary>(main_url + 'grade/overall_summary/' + positionId + '/' + prospectId + '/', {summary: payload}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }))
  }

}

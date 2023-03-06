import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {main_url} from "../../../environments/environment";
import {BugsList, BugsListApi, PostBugs} from "../interfaces/bugs-list";
import {map} from "rxjs/operators";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {LoadingService} from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class BugsListService {
  listData: BugsList[] = []

  constructor(private http: HttpClient, public loadingService: LoadingService) {
  }

  getBugsListData(): void {
    this.loadingService.loading.next(true)
    this.http.get<BugsListApi>(
      `${main_url}support_request/`
    ).pipe(map(e => e.results)).subscribe((data) => {
      this.listData = data;
      this.loadingService.loading.next(false)
    });
  }

  editBugStatus(id: number, payload: string): Observable<BugsList> {
    this.loadingService.loading.next(true)
    return this.http.patch<BugsList>(main_url + 'support_request/' + id + '/', {status: payload}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  postBug(value: { subject: string, message: string }, fileList: NzUploadFile[]): Observable<PostBugs> {
    const formData = new FormData();
    fileList.forEach((resource: any, i) => {
      formData.append('attachments', resource);

    });
    formData.append('subject', value.subject);
    formData.append('message', value.message);
    return this.http.post<PostBugs>(main_url + 'support_request/create_request/', formData).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  deleteTicket(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${main_url}support_request/${id}/`).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }
}

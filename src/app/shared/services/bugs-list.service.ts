import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {main_url} from "../../../environments/environment";
import {BugsList, BugsListApi, PostBugs} from "../interfaces/bugs-list";
import {map} from "rxjs/operators";
import {NzUploadFile} from "ng-zorro-antd/upload";

@Injectable({
  providedIn: 'root'
})
export class BugsListService {

  constructor(private http: HttpClient) {
  }

  getBugsListData(): Observable<BugsList[]> {
    return this.http.get<BugsListApi>(
      `${main_url}support_request/`
    ).pipe(map(e => e.results));
  }

  editBugStatus(id: number, payload: string): Observable<BugsList> {
    return this.http.patch<BugsList>(main_url + 'support_request/' + id + '/', {status: payload})
  }

  postBug(value: { subject: string, message: string }, fileList: NzUploadFile[]): Observable<PostBugs> {
    const formData = new FormData();
    fileList.forEach((file: any) => {
      formData.append('myfile', file);
    });
    console.log(formData)
    return this.http.post<PostBugs>(main_url + 'support_request/create_request/', {...value, formData})
  }

}

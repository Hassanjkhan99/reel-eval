import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "./loading.service";
import {Observable, tap} from "rxjs";
import {main_url} from "../../../environments/environment";
import {Customers, CustomersApi, editCustomer} from "../interfaces/customers";

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient,
              public loadingService: LoadingService) {
  }

  getCustomers(
    pageIndex,
    pageSize,
    sortField?,
    sortOrder?,
    filter?,
    filterField?: string
  ): Observable<CustomersApi> {
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

    if (filter && filterField && filterField === 'name') {
      params[filterField + '__icontains'] = filter;
    } else {
      params[filterField] = filter;
    }
    return this.http.get<CustomersApi>(main_url + 'get_all_clubs/', {params}).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

  editCustomer(id: number, payload: editCustomer): Observable<Customers> {
    return this.http.patch<Customers>(`${main_url}get_all_clubs/${id}/`, payload).pipe(tap((val) => {
      this.loadingService.loading.next(false)
    }));
  }

}

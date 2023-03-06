import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomersService} from '../../shared/services/customers.service';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableFilterValue,
  NzTableModule,
  NzTableQueryParams,
} from 'ng-zorro-antd/table';
import {LoadingService} from '../../shared/services/loading.service';
import {Prospect} from '../../shared/interfaces/prospect.interface';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzInputModule} from 'ng-zorro-antd/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NotificationService} from '../../shared/services/notification.service';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDropDownModule,
    NzInputModule,
    FormsModule,
    NzToolTipModule,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzDatePickerModule,
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customerForm = new FormGroup({
    club_is_active: new FormControl(null),
    reel_eval_customer: new FormControl(null),
    subscription_expiry_date: new FormControl(null),
  });
  customers: {
    club_is_active: string;
    name: string;
    reel_eval_customer: string;
    id: number;
    subscription_expiry_date: string;
  }[] = [];
  currentEditIndex: number = -1;
  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortField: 'name',
    },
    {
      name: 'Club is Active',
      sortField: 'club_is_active',
    },
    {
      name: 'Reel Eval Customer',
      sortField: 'reel_eval_customer',
    },
    {
      name: 'Subscription Expiry Date',
      sortField: 'subscription_expiry_date',
    },
  ];
  total: number;
  visible = {
    name: false,
    club_is_active: false,
    reel_eval_customer: false,
    subscription_expiry_date: false,
  };
  searchValue = {
    name: '',
    club_is_active: '',
    reel_eval_customer: '',
  };
  listOfFilter = ['name', 'club_is_active', 'reel_eval_customer'];
  pageSize: number = 10;
  pageIndex: number = 1;
  private params: NzTableQueryParams;
  private filterField: string = '';
  private currentFilterValue: Array<{ key: string; value: NzTableFilterValue }>;

  constructor(
    private customerService: CustomersService,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.customerService
      .getCustomers(this.pageIndex, this.pageSize, null, null, null)
      .subscribe((cus) => {
        this.customers = cus.results.map((customer) => {
          return {
            id: customer.id,
            name: customer.name,
            club_is_active: String(customer.club_is_active),
            reel_eval_customer: String(customer.reel_eval_customer),
            subscription_expiry_date: customer.subscription_expiry_date,
          };
        });
        this.total = cus.count;
      });
  }

  isEdit(i: number) {
    if (this.currentEditIndex != i && this.currentEditIndex > -1) {
      this.notificationService.error(
        "Can't edit another row while editing a row",
        'You are currently editing a row , ' +
        'please discard or save the changes'
      );
      return;
    }
    this.currentEditIndex = i;
    this.customerForm.patchValue({
      club_is_active: this.customers[i].club_is_active,
      reel_eval_customer: this.customers[i].reel_eval_customer,
      subscription_expiry_date: this.customers[i].subscription_expiry_date,
    });
    this.cdr.detectChanges();
  }

  isSave(i: number) {
    let date = this.customerForm.controls.subscription_expiry_date.value;
    if (date) {
      date =
        date.getMonth() > 8
          ? date.getMonth() + 1
          : '0' +
          (date.getMonth() + 1) +
          '-' +
          (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
          '-' +
          date.getFullYear();
      this.customerForm.controls.subscription_expiry_date.setValue(date)
    }
    this.customerService
      .editCustomer(this.customers[i].id, {
        ...this.customers[i],
        ...this.customerForm.value,
      })
      .subscribe((customer) => {
        this.notificationService.success(
          'Success',
          'Your changes has been saved!'
        );
        this.customers = this.customers.map((item) => {
          if (item.id === customer.id) {
            return {
              id: customer.id,
              name: customer.name,
              club_is_active: String(customer.club_is_active),
              reel_eval_customer: String(customer.reel_eval_customer),
              subscription_expiry_date: customer.subscription_expiry_date,
            };
          } else {
            return item;
          }
        });
        this.customerForm.reset()
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      });
  }

  cancel(): void {
    this.notificationService.info('clicked cancel', '', 'top');
  }

  confirm(): void {
    this.notificationService.info('clicked confirmed', '', 'top');
    this.currentEditIndex = -1;
  }

  reset(key) {
    this.searchValue[key] = '';

    this.search(key);
  }

  search(key) {
    this.visible[key] = false;
    this.onQueryParamsChange(
      {...this.params, filter: this.searchValue[key]},
      key
    );
  }

  onQueryParamsChange(params: NzTableQueryParams, filterField?: string): void {
    if (filterField) {
      this.filterField = filterField;
      this.currentFilterValue = params.filter;
    }
    const {pageSize, pageIndex, sort, filter} = params;
    this.params = {...params, filter: this.currentFilterValue};

    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.customerService
      .getCustomers(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        this.params.filter,
        this.filterField
      )
      .subscribe((result) => {
        console.log({pageIndex, pageSize, sortField, sortOrder, filter});
        const customer = result.results;
        this.customers = customer.map((cus) => {
          return {
            id: cus.id,
            name: cus.name,
            club_is_active: String(cus.club_is_active),
            reel_eval_customer: String(cus.reel_eval_customer),
            subscription_expiry_date: cus.subscription_expiry_date,
          };
        });
        this.total = result.count;
      });
  }
}

interface ColumnItem {
  name: string;
  sortField: string;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn<Partial<Prospect>> | null;
  filterMultiple?: boolean;
}

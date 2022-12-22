import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TraitsService} from '../../shared/services/traits.service';
import {NzListModule} from 'ng-zorro-antd/list';
import {Trait} from '../../shared/interfaces/trait';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableFilterValue,
  NzTableModule,
  NzTableQueryParams,
} from 'ng-zorro-antd/table';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NotificationService} from '../../shared/services/notification.service';
import {Prospect} from '../../shared/interfaces/prospect.interface';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-traits',
  standalone: true,
  imports: [
    CommonModule,
    NzListModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    FormsModule,
    NzDropDownModule,
    NzToolTipModule,
  ],
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
})
export class TraitsComponent implements OnInit {
  traitForm = new FormGroup({
    trait: new FormControl(''),
    description: new FormControl(''),
  });
  total = 0;
  traits: Trait[] = [];
  showRow: boolean = false;
  currentEditIndex: number = -1;
  listOfColumns: ColumnItem[] = [
    {
      name: 'Trait',
    },
    {
      name: 'Description',
    },
  ];
  visible = {
    trait: false,
    description: false,
  };
  searchValue = {
    trait: '',
    description: '',
  };
  listOfFilter = ['trait', 'description'];
  pageSize: number = 10;
  pageIndex: number = 1;
  private params: NzTableQueryParams;
  private filterField: string = '';
  private currentFilterValue: Array<{ key: string; value: NzTableFilterValue }>;

  constructor(
    private traitsService: TraitsService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.traitsService
      .getAllTraits(this.pageIndex, this.pageSize, null, null, null)
      .subscribe((traits) => {
        this.traits = traits.results;
        this.total = traits.count;
      });
  }

  addNewTraitRow() {
    if (this.currentEditIndex > -1 || this.showRow) {
      this.notificationService.error(
        "Can't add another row while editing a row",
        'You are currently editing a row , ' +
        'please discard or save the changes'
      );
      return;
    }
    this.traitForm.reset();
    this.showRow = false;
    this.cdr.detectChanges();
    this.showRow = true;
    this.cdr.detectChanges();
  }

  isEdit(i: number) {
    if (
      (this.currentEditIndex != i && this.currentEditIndex > -1) ||
      this.showRow
    ) {
      this.notificationService.error(
        "Can't edit another row while editing a row",
        'You are currently editing a row , ' +
        'please discard or save the changes'
      );
      return;
    }
    this.traitForm.setValue({
      trait: this.traits[i].trait,
      description: this.traits[i].description,
    });

    this.currentEditIndex = i;
  }

  isSave(i: number) {
    this.traitsService
      .editTrait(this.traits[i].id, {
        ...this.traits[i],
        ...this.traitForm.value,
      })
      .subscribe((x) => {
        this.notificationService.success(
          'Success',
          'Your changes has been saved!'
        );
        this.traits = this.traits.map((item) => {
          if (item.id === x.id) {
            return x;
          } else {
            return item;
          }
        });
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      });
  }

  isDelete(i: number) {
    this.traitsService.deleteTrait(this.traits[i].id).subscribe((x) => {
      this.notificationService.success(
        'Success',
        'Selected Prospect has been deleted!'
      );
      // this.traits.splice(i,1)
      this.traits = this.traits
        .map((item) => {
          if (item.id == this.traits[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);
      this.currentEditIndex = -1;
      this.cdr.detectChanges();
    });
  }

  cancel(): void {
    this.notificationService.info('clicked cancel', '', 'top');
  }

  confirm(): void {
    this.notificationService.info('clicked confirmed', '', 'top');
    this.showRow = false;
    this.currentEditIndex = -1;
  }

  isSaveNew(isAddAnother: boolean) {
    this.traitsService.saveTrait(this.traitForm.value).subscribe((x) => {
      this.notificationService.success('Success', 'Your Trait has been added');
      // @ts-ignore
      this.traits = [x, ...this.traits];
      if (isAddAnother) {
        this.traitForm.reset();
        this.showRow = false;
        this.cdr.detectChanges();
        this.showRow = true;
      } else {
        this.showRow = false;
      }
      this.cdr.detectChanges();
    });
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
    this.params = {...params, filter: this.currentFilterValue}

    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.traitsService
      .getAllTraits(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        this.params.filter,
        this.filterField
      )
      .subscribe((e) => {
        console.log({pageIndex, pageSize, sortField, sortOrder, filter});
        this.traits = e.results;
        this.total = e.count;
      });
  }
}

interface ColumnItem {
  name: string;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn<Partial<Prospect>> | null;
  filterMultiple?: boolean;
}

import {ChangeDetectorRef, Component, EventEmitter, Input, Output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NzTableFilterList,
  NzTableFilterValue,
  NzTableModule,
  NzTableQueryParams,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {ProspectService} from '../../../shared/services/prospect.service';
import {NzInputModule} from 'ng-zorro-antd/input';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';
import {Position} from '../../../shared/interfaces/positions.interface';
import {Prospect} from '../../../shared/interfaces/prospect.interface';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {TabsComponent} from '../tabs/tabs.component';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NotificationService} from '../../../shared/services/notification.service';
import {NzSafeAny} from 'ng-zorro-antd/core/types';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {
  PositionMultiSelectComponent
} from '../../../shared/components/position-multi-select/position-multi-select.component';
import {
  StatesSelectSearchComponent
} from '../../../shared/components/states-select-search/states-select-search.component';
import {
  SchoolSelectSearchComponent
} from '../../../shared/components/school-select-search/school-select-search.component';
import {UntilDestroy} from "@ngneat/until-destroy";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzResizableModule} from "ng-zorro-antd/resizable";
import {AuthenticationService} from "../../../shared/services/authentication.service";
import {Permissions} from '../../../shared/enums/permissions';
import {LoadingService} from "../../../shared/services/loading.service";

@UntilDestroy()
@Component({
  selector: 'app-view-prospect',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
    PositionsSelectComponent,
    NzPopconfirmModule,
    NzButtonModule,
    TabsComponent,
    NzDropDownModule,
    FormsModule,
    NzListModule,
    NzToolTipModule,
    PositionMultiSelectComponent,
    StatesSelectSearchComponent,
    SchoolSelectSearchComponent,
    NzGridModule,
    NzSelectModule,
    NzResizableModule,
  ],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
})
export class ViewProspectComponent {
  @Input() dataSet: Prospect[] = [];
  @Input() classificationList: { name: string }[] = [];
  @Input() stateList: { name: string }[] = [];
  @Input() schoolList: { name: string }[] = [];
  @Input() achievedTable: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number;
  @Input() params: NzTableQueryParams;
  @Input() total = 0;
  @Input() positionListFilter: Array<{
    text: string;
    value: NzSafeAny;
    byDefault?: boolean;
  }> = [];

  @Output() queryParamsChange: EventEmitter<{
    params: NzTableQueryParams;
    filterField?: string;
  }> = new EventEmitter<{ params: NzTableQueryParams; filterField?: string }>();
  @Output() prospectArchived: EventEmitter<Prospect> =
    new EventEmitter<Prospect>();
  @Output() prospectUnArchived: EventEmitter<Prospect> =
    new EventEmitter<Prospect>();
  permissions = Permissions

  listOfColumns: ColumnItem[] = [
    {
      name: 'First Name',
      width: '160px'
    },
    {
      name: 'Last Name',
      width: '150px'
    },
    {
      name: 'Positions',
      width: '150px'
    },
    {
      name: 'Class/Yr',
      width: '130px',
      tooltip: true,
      tooltipText: 'Classification/Year',
    },
    {
      name: 'State/Province',
      width: '200px',
    },
    {
      name: 'School/Team',
      width: '220px'
    },
    {
      name: 'Video url',
      width: '130px'
    },
    // {
    //   name: 'Score',
    //   width: '150px'
    // },
    // {
    //   name: 'IGA Score',
    //   width: '130px'
    // },
  ];

  listOfFilter = [
    'first_name',
    'last_name',
    'position__position_name',
    'classification',
    'state',
    'school',
    'video_link',
    // 'score',
    // 'ig'
  ];
  listOfSort = [
    'first_name',
    'last_name',
    'position',
    'classification',
    'state',
    'school',
    'video_link',
  ];

  visible = {
    first_name: false,
    last_name: false,
    position__position_name: false,
    classification: false,
    state: false,
    school: false,
    video_link: false,
  };
  searchValue = {
    first_name: '',
    last_name: '',
    position__position_name: '',
    classification: '',
    state: '',
    school: '',
    video_link: '',
  };
  showRow: Boolean = false;
  prospectForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    position: new FormControl([null]),
    classification: new FormControl(''),
    state: new FormControl(''),
    school: new FormControl(''),
    video_link: new FormControl(''),
    archived: new FormControl(false),
  });

  currentEditIndex: number;

  stateSearchFormControl = new FormControl<string>(null);
  positionSearchFormControl = new FormControl<string>(null);
  schoolSearchFormControl = new FormControl<string>(null);
  positionFormControl = new FormControl([null]);

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Prospect[] = [];
  setOfCheckedId = new Set<number>();
  checkedIds: number[] = [];
  private filterField: string = '';
  private currentFilterValue: Array<{ key: string; value: NzTableFilterValue }>;
  positions: Position[];

  constructor(
    private fb: FormBuilder,
    private prospectSer: ProspectService,
    private cdr: ChangeDetectorRef,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,
    private prospectService: ProspectService,
    protected authService: AuthenticationService,
    public loadingService: LoadingService
  ) {
  }

  get school() {
    return this.prospectForm.controls.school;
  }

  get state() {
    return this.prospectForm.controls.school;
  }

  ngOnInit() {
    this.stateSearchFormControl.valueChanges.subscribe((val) => {
      console.log('stateSearchFormControl: ', val);
      this.searchValue.state = val;
    });
    this.schoolSearchFormControl.valueChanges.subscribe((val) => {
      this.searchValue.school = val;
    });
    this.positionSearchFormControl.valueChanges.subscribe((val) => {
      this.searchValue.position__position_name = val;
    });
    this.positionFormControl.valueChanges.subscribe((val) => {
      this.prospectForm.controls.position.setValue(val);
      console.log(this.positionFormControl.value)
    })
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions.map(e => {
        return {
          id: e.id, position_name: e.position_name
        }
      })
      this.cdr.detectChanges()
    })
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
    // this.listOfColumns[2].width = '600px';
    this.currentEditIndex = i;
    this.positionFormControl.setValue(this.dataSet[i].position)
    this.prospectForm.setValue({
      first_name: this.dataSet[i].first_name,
      last_name: this.dataSet[i].last_name,
      position: this.dataSet[i].position,
      classification: this.dataSet[i].classification,
      state: this.dataSet[i].state,
      school: this.dataSet[i].school,
      video_link: this.dataSet[i].video_link,
      archived: false,
    });
  }

  isSave(i: number) {
    // this.listOfColumns[2].width = '250px';
    this.prospectSer
      .editProspect(this.dataSet[i].id, {
        ...this.dataSet[i],
        ...this.prospectForm.value,
      })
      .subscribe((x) => {
        this.notificationService.success(
          'Success',
          'Your changes has been saved!'
        );
        this.dataSet = this.dataSet.map((item) => {
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
    this.prospectSer.deleteProspect(this.dataSet[i].id).subscribe(() => {
      this.notificationService.success(
        'Success',
        'Selected Prospect has been deleted!'
      );
      // this.dataSet.splice(i,1)
      this.dataSet = this.dataSet
        .map((item) => {
          if (item.id == this.dataSet[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);
      this.currentEditIndex = -1;
      this.cdr.detectChanges();
    });
  }

  setPosition(position: any[]) {
    this.prospectForm.get('position').setValue(position);
  }


  cancel(): void {
    this.nzMessageService.info('clicked cancel');
    this.listOfColumns[2].width = '450px';
  }

  confirm(): void {
    this.nzMessageService.info('clicked confirm');
    this.currentEditIndex = -1;
    this.showRow = false;
    this.listOfColumns[2].width = '450px';
  }

  isArchive(i: number) {
    this.prospectSer
      .editProspect(this.dataSet[i].id, {...this.dataSet[i], archived: true})
      .subscribe(() => {
        this.notificationService.success(
          'Success',
          'Your Prospect has been archived'
        );

        this.prospectArchived.emit(this.dataSet[i]);

        this.dataSet = this.dataSet
          .map((item) => {
            if (item.id == this.dataSet[i].id) {
              return;
            }
            return item;
          })
          .filter((e) => e);
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      });
  }

  isUnArchive(i: number) {
    this.prospectSer.unArchiveProspect(this.dataSet[i].id).subscribe(() => {
      this.notificationService.success(
        'Success',
        'Your changes has been unarchived!'
      );
      this.prospectUnArchived.emit(this.dataSet[i]);

      this.dataSet = this.dataSet
        .map((item) => {
          if (item.id == this.dataSet[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);
      this.currentEditIndex = -1;
      this.cdr.detectChanges();
    });
  }

  reset(key) {
    this.searchValue[key] = '';
    if (key === 'position__position_name') {
      this.positionSearchFormControl.reset()
    }
    if (key === 'school') {
      this.schoolSearchFormControl.reset()
    }
    if (key === 'state') {
      this.stateSearchFormControl.reset()
    }
    this.search(key);
  }


  search(key) {
    this.visible[key] = false;
    this.onQueryParamsChange(
      {...this.params, filter: this.searchValue[key]},
      key
    );
  }

  isSaveNew(isAddAnother: boolean) {
    this.prospectSer.postAddProspect(this.prospectForm.value).subscribe((x) => {
      this.notificationService.success(
        'Success',
        'Your Prospect has been added'
      );
      this.dataSet = [x, ...this.dataSet];
      if (isAddAnother) {
        this.prospectForm.reset();
        this.prospectForm.controls.archived.setValue(false);
        this.showRow = false;
        this.cdr.detectChanges();
        this.showRow = true;
      } else {
        this.showRow = false;
      }
      this.cdr.detectChanges();
    });
  }

  addProspect() {
    if (this.currentEditIndex > -1 || this.showRow) {
      this.notificationService.error(
        "Can't add another row while editing a row",
        'You are currently editing a row , ' +
        'please discard or save the changes'
      );
      return;
    }
    this.prospectForm.reset({
      school: '',
      archived: false,
      position: [],
      classification: '',
      first_name: '',
      last_name: '',
      state: '',
      video_link: '',
    });
    this.showRow = false;
    console.log(this.prospectForm.value);
    this.cdr.detectChanges();
    this.showRow = true;
    this.cdr.detectChanges();
  }

  onQueryParamsChange(params: NzTableQueryParams, filterField?: string): void {
    if (filterField) {
      this.filterField = filterField;
      this.currentFilterValue = params.filter;
    }
    this.queryParamsChange.emit({
      params: {...params, filter: this.currentFilterValue},
      filterField: this.filterField,
    });
  }

  exportCompleteListToExcel() {
    this.prospectSer.exportCompleteListToExcel(this.achievedTable).subscribe((response) => {
      this.download(response);
    });
  }

  exportListToExcel() {
    this.prospectSer
      .exportToExcel(this.achievedTable, [...this.setOfCheckedId])
      .subscribe((response) => {
        this.download(response);
      });
  }

  download(response) {
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData));
    downloadLink.setAttribute('download', 'ProspectsList.xls');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.checkedIds = [...this.setOfCheckedId];
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    console.log(this.setOfCheckedId);
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
    console.log(this.setOfCheckedId);
  }

  onCurrentPageDataChange($event: readonly Prospect[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }
}

interface ColumnItem {
  name: string;
  width?: string;
  sortOrder?: NzTableSortOrder | null;
  sortFn?: NzTableSortFn<Partial<Prospect>> | null;
  listOfFilter?: NzTableFilterList;
  filterFn?: (list: any, item: Prospect) => void;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
  tooltip?: boolean;
  tooltipText?: string;
}

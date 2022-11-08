import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NzTableFilterFn,
  NzTableFilterList,
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
import {Positions} from '../../../shared/interfaces/positions.interface';
import {Prospect} from '../../../shared/interfaces/prospect.interface';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {TabsComponent} from '../tabs/tabs.component';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NotificationService} from '../../../shared/services/notification.service';

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
  ],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
})
export class ViewProspectComponent implements OnInit {
  @Input() dataSet: Prospect[] = [];
  @Input() originalDataSet: Prospect[] = [];
  @Input() achievedTable: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() params: NzTableQueryParams;
  @Output() queryParmsChange: EventEmitter<{
    params: NzTableQueryParams;
    filterField?: string;
  }> = new EventEmitter<{ params: NzTableQueryParams; filterField?: string }>();
  @Output() prospectArchived: EventEmitter<Prospect> =
    new EventEmitter<Prospect>();
  @Output() prospectUnArchived: EventEmitter<Prospect> =
    new EventEmitter<Prospect>();

  total = 0;

  listOfColumns: ColumnItem[] = [
    {
      name: 'First Name',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) =>
        a.first_name.localeCompare(b.first_name),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Last Name',
      sortOrder: 'ascend',
      sortFn: (a: Prospect, b: Prospect) =>
        a.last_name.localeCompare(b.last_name),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Position',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) =>
        a.position.position_name.localeCompare(b.position.position_name),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Classification/Year',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) =>
        a.classification.localeCompare(b.classification),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'State/Province',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) => a.state.localeCompare(b.state),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'School/Team',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) => a.school.localeCompare(b.school),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Video Link',
      sortOrder: null,
      sortFn: (a: Prospect, b: Prospect) => {
        if (a.video_link) return a.video_link.localeCompare(b.video_link);
      },
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  listOfFilter = [
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
    position: false,
    classification: false,
    state: false,
    school: false,
    video_link: false,
  };
  searchValue = {
    first_name: '',
    last_name: '',
    position: '',
    classification: '',
    state: '',
    school: '',
    video_link: '',
  };
  showRow: Boolean = false;
  prospectForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    position: new FormControl({
      id: 0,
      position_name: '',
    }),
    classification: new FormControl(''),
    state: new FormControl(''),
    school: new FormControl(''),
    video_link: new FormControl(''),
    archived: new FormControl(false),
  });

  currentEditIndex: number;
  currentPosition: number;

  constructor(
    private fb: FormBuilder,
    private prospectSer: ProspectService,
    private cdr: ChangeDetectorRef,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
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

    this.currentPosition = this.dataSet[i].position.id;
    this.currentEditIndex = i;
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
        const dataSet = this.dataSet.map((item) => {
          if (item.id === x.id) {
            return x;
          } else {
            return item;
          }
        });
        this.originalDataSet = dataSet;
        this.dataSet = dataSet;
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      });
  }

  isDelete(i: number) {
    this.prospectSer.deleteProspect(this.dataSet[i].id).subscribe((x) => {
      this.notificationService.success(
        'Success',
        'Selected Prospect has been deleted!'
      );
      // this.dataSet.splice(i,1)
      const dataSet = this.dataSet
        .map((item) => {
          if (item.id == this.dataSet[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);
      this.originalDataSet = dataSet;
      this.dataSet = dataSet;
      this.currentEditIndex = -1;
      this.cdr.detectChanges();
    });
  }

  setPosition(position: Positions) {
    this.prospectForm.get('position').setValue(position);
    console.log(position.position_name);
  }

  addPosition(position: Positions) {
    console.log(position);
    this.prospectForm.controls.position.setValue(position);
    this.prospectForm.updateValueAndValidity();
  }

  cancel(): void {
    this.nzMessageService.info('clicked cancel');
  }

  confirm(): void {
    this.nzMessageService.info('clicked confirm');
    this.currentEditIndex = -1;
    this.showRow = false;
  }

  isArchive(i: number) {
    this.prospectSer
      .editProspect(this.dataSet[i].id, {...this.dataSet[i], archived: true})
      .subscribe((x) => {
        this.notificationService.success(
          'Success',
          'Your Prospect has been archived'
        );

        this.prospectArchived.emit(this.dataSet[i]);

        const dataSet = this.dataSet
          .map((item) => {
            if (item.id == this.dataSet[i].id) {
              return;
            }
            return item;
          })
          .filter((e) => e);

        this.originalDataSet = dataSet;
        this.dataSet = dataSet;
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      });
  }

  isUnArchive(i: number) {
    this.prospectSer.unArchiveProspect(this.dataSet[i].id).subscribe((x) => {
      this.notificationService.success(
        'Success',
        'Your changes has been unarchived!'
      );
      this.prospectUnArchived.emit(this.dataSet[i]);

      const dataSet = this.dataSet
        .map((item) => {
          if (item.id == this.dataSet[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);

      this.originalDataSet = dataSet;
      this.dataSet = dataSet;
      this.currentEditIndex = -1;
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

  isSaveNew(isAddAnother: boolean) {
    this.prospectSer.postAddProspect(this.prospectForm.value).subscribe((x) => {
      this.notificationService.success(
        'Success',
        'Your Prospect has been added'
      );
      const dataSet = [x, ...this.dataSet];

      this.originalDataSet = dataSet;
      this.dataSet = dataSet;
      if (isAddAnother) {
        this.prospectForm.reset();
        this.prospectForm.controls.archived.setValue(false);
        this.currentPosition = -1;
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
    this.prospectForm.reset();
    this.prospectForm.controls.archived.setValue(false);
    this.currentPosition = -1;
    this.showRow = false;
    this.cdr.detectChanges();
    this.showRow = true;
    this.cdr.detectChanges();
  }

  onQueryParamsChange(params: NzTableQueryParams, filterField?: string): void {
    console.log({params})

    this.queryParmsChange.emit({params, filterField});
  }
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Partial<Prospect>> | null;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn<Partial<Prospect>> | null;
  filterMultiple?: boolean;
  sortDirections: NzTableSortOrder[];
}

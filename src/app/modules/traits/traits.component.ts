import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TraitsService} from '../../shared/services/traits.service';
import {NzListModule} from 'ng-zorro-antd/list';
import {Trait} from '../../shared/interfaces/trait';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder,} from 'ng-zorro-antd/table';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NotificationService} from '../../shared/services/notification.service';
import {Prospect} from '../../shared/interfaces/prospect.interface';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";

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
  ],
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
})
export class TraitsComponent implements OnInit {

  traitForm = new FormGroup({
    trait: new FormControl(''),
    description: new FormControl(''),
  });


  traits: Trait[] = [];
  showRow: boolean = false;
  currentEditIndex: number = -1;
  listOfColumns: ColumnItem[] = [
    {
      name: 'Trait',
      sortOrder: 'ascend',
      sortFn: (a: Trait, b: Trait) => {
        if (a.trait) return a.trait.localeCompare(b.trait)
      },
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Description',
      sortOrder: null,
      sortFn: (a: Trait, b: Trait) => {
        if (a.description) return a.description.localeCompare(b.description)
      },
      sortDirections: ['ascend', 'descend', null],
    },
  ];
  visible = {
    trait: false, description: false
  };
  searchValue = {
    trait: '', description: ''
  };
  listOfFilter = ['trait', 'description',]
  private originalTraits: Trait[] = [];

  constructor(
    private traitsService: TraitsService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.traitsService.getAllTraits().subscribe((traits) => {
      this.traits = traits;
      this.originalTraits = traits
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
        const traits = this.traits.map((item) => {
          if (item.id === x.id) {
            return x;
          } else {
            return item;
          }
        });
        this.originalTraits = traits
        this.traits = traits
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
      const traits = this.traits
        .map((item) => {
          if (item.id == this.traits[i].id) {
            return;
          }
          return item;
        })
        .filter((e) => e);
      this.originalTraits = traits
      this.traits = traits
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
      const traits: Trait[] = [x, ...this.traits];
      this.originalTraits = traits
      this.traits = traits
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
    this.searchValue[key] = ''

    this.search(key);
  }

  search(key) {
    this.visible[key] = false;
    this.traits = this.originalTraits.filter((item: Trait) => item[key].indexOf(this.searchValue[key]) !== -1);
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

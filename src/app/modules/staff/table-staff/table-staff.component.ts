import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";
import {StaffService} from "../../../shared/services/staff.service";
import {map} from "rxjs/operators";
import {StaffList} from "../../../shared/interfaces/staff.interface";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NotificationService} from "../../../shared/services/notification.service";

@Component({
  selector: 'app-table-staff',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzDropDownModule, NzInputModule, NzButtonModule, FormsModule, NzIconModule, NzPopconfirmModule, ReactiveFormsModule],
  templateUrl: './table-staff.component.html',
  styleUrls: ['./table-staff.component.scss'],
})
export class TableStaffComponent implements OnInit {

  staffCount: number = 0;
  currentEditIndex: number = -1;
  listOfColumns = ['First Name', 'Last Name', 'Username', 'Email', 'Actions'];
  listOfFilter = ['first_name', 'last_name', 'username', 'email', 'actions'];
  listOfData: StaffList[] = [];
  originalListOfData: StaffList[] = [];
  visible = {
    first_name: false, last_name: false, username: false, email: false, actions: false
  };
  searchValue = {
    first_name: '', last_name: '', username: '', email: '', actions: ''
  };
  staffForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),

  });

  constructor(private cdr: ChangeDetectorRef, private staffSer: StaffService, private notificationService: NotificationService) {
  }

  getStaff() {
    this.staffSer.getStaff().pipe(map(value => value.results)).subscribe(
      x => {
        console.log(x);
        this.cdr.detectChanges();
        this.listOfData = x;
        this.originalListOfData = x;
      }
    )
  }

  ngOnInit(): void {
    this.getStaff();
    this.staffSer.getStaff().pipe(map(result => result.count)).subscribe(e => {
      this.staffCount = e;
    })
  }

  reset(key) {
    this.searchValue[key] = ''

    this.search(key);
  }

  search(key) {
    console.log(this.listOfData)
    this.visible[key] = false;
    console.log({key})
    this.listOfData = this.originalListOfData.filter((item: StaffList) => item[key].indexOf(this.searchValue[key]) !== -1);
    console.log(this.listOfData)
    console.log(this.searchValue)
  }

  isEdit(i: number) {
    if ((this.currentEditIndex != i && this.currentEditIndex > -1)) {
      this.notificationService.error("Can't edit another row while editing a row", 'You are currently editing a row , ' +
        'please discard or save the changes')
      return
    }

    this.currentEditIndex = i;
    this.staffForm.setValue({
      first_name: this.listOfData[i].first_name,
      last_name: this.listOfData[i].last_name,
      username: this.listOfData[i].username,
      email: this.listOfData[i].email,

    })
  }

  isSave(i: number) {

    this.staffSer.editStaff(this.listOfData[i].id, {...this.listOfData[i], ...this.staffForm.value}).subscribe(
      x => {
        this.notificationService.success('Success', 'Your changes has been saved!');
        this.listOfData = this.listOfData.map(item => {
          if (item.id === x.id) {
            return x
          } else {
            return item
          }
        })
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      }
    )
  }

  isDelete(i: number) {

    this.staffSer.deleteStaff(this.listOfData[i].id).subscribe(
      x => {
        this.notificationService.success('Success', 'Selected Staff has been deleted!')
        // this.listOfData.splice(i,1)
        this.listOfData = this.listOfData.map((item) => {
          if (item.id == this.listOfData[i].id) {
            return
          }
          return item
        }).filter(e => e)
        this.currentEditIndex = -1
        this.cdr.detectChanges();
      },
    )
  }

  cancel(): void {
    this.notificationService.info('clicked cancel', '', 'top');
  }

  confirm(): void {
    this.notificationService.info('clicked confirm', '', 'top');
    this.currentEditIndex = -1;
  }


}


interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}

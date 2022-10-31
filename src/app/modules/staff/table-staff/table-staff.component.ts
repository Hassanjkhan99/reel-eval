import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";
import {StaffService} from "../../../shared/services/staff.service";
import {map} from "rxjs/operators";
import {StaffList} from "../../../shared/interfaces/staff.interface";

@Component({
  selector: 'app-table-staff',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzDropDownModule, NzInputModule, NzButtonModule, FormsModule, NzIconModule],
  templateUrl: './table-staff.component.html',
  styleUrls: ['./table-staff.component.scss'],
})
export class TableStaffComponent implements OnInit {

  // firstNameFilterItems = []
  // lastNameFilterItems = []
  // emailFilterItems = []
  // usernameFilterItems = []

  listOfColumns = ['First Name', 'Last Name', 'Username', 'Email'];
  listOfData: StaffList[] = [];
  visible: boolean = true;
  searchValue: string = '';

  constructor(private cdr: ChangeDetectorRef, private staffSer: StaffService) {
  }

  getStaff() {
    this.staffSer.getStaff().pipe(map(value => value.results)).subscribe(
      x => {
        console.log(x);
        this.cdr.detectChanges();
        this.listOfData = x;
      }
    )
  }

  ngOnInit(): void {
    this.getStaff();

    //  const filteredFirstNameData = [...new Set(this.listOfData.map(e => {
    //    return e.firstName
    //  }))]
    //
    // this.firstNameFilterItems = filteredFirstNameData.map(e => {
    //    return {
    //      text: e,
    //      value: e
    //    }
    //  })
    //
    //  const filteredLastNameData = [...new Set(this.listOfData.map(e => {
    //    return e.last_Name
    //  }))]
    //
    //  this.lastNameFilterItems = filteredLastNameData.map(e => {
    //    return {
    //      text: e,
    //      value: e
    //    }
    //  })
    //
    //  const filteredEmailData = [...new Set(this.listOfData.map(e => {
    //    return e.email
    //  }))]
    //
    //  this.emailFilterItems = filteredEmailData.map(e => {
    //    return {
    //      text: e,
    //      value: e
    //    }
    //  })
    //
    //  const filteredUserNameData = [...new Set(this.listOfData.map(e => {
    //    return e.username
    //  }))]
    //
    //  this.usernameFilterItems = filteredUserNameData.map(e => {
    //    return {
    //      text: e,
    //      value: e
    //    }
    //  })
    //
    //  this.listOfColumns= [
    //    {
    //      name: 'First Name',
    //      sortOrder: null,
    //      sortFn: (a: DataItem, b: DataItem) => a.firstName.localeCompare(b.firstName),
    //      filterMultiple: true,
    //      listOfFilter: this.firstNameFilterItems,
    //      filterFn: (list: string[], item: DataItem) => list.some(firstName => item.firstName.indexOf(firstName) !== -1)
    //    },
    //    {
    //      name: 'Last Name',
    //      sortOrder: null,
    //      sortFn: (a: DataItem, b: DataItem) => a.lastName.localeCompare(b.lastName),
    //      filterMultiple: true,
    //      listOfFilter: this.lastNameFilterItems,
    //      filterFn: (list: string[], item: DataItem) => list.some(lastName => item.lastName.indexOf(lastName) !== -1)
    //    },
    //    {
    //      name: 'Email',
    //      sortOrder: 'descend',
    //      sortFn: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email),
    //      filterMultiple: true,
    //      listOfFilter: this.emailFilterItems,
    //      filterFn: (list: string[], item: DataItem) => list.some(email => item.email.indexOf(email) !== -1)
    //    },
    //    {
    //      name: 'Username',
    //      sortOrder: null,
    //      sortFn: (a: DataItem, b: DataItem) => a.username.length - b.username.length,
    //      filterMultiple: false,
    //      listOfFilter:this.usernameFilterItems,
    //      filterFn: (username: string, item: DataItem) => item.username.indexOf(username) !== -1
    //    }
    //  ]
  }


  search() {

  }

  reset() {

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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-table-staff',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzDropDownModule, NzInputModule, NzButtonModule, FormsModule, NzIconModule],
  templateUrl: './table-staff.component.html',
  styleUrls: ['./table-staff.component.scss'],
})
export class TableStaffComponent implements OnInit{

  firstNameFilterItems = []
  lastNameFilterItems = []
  emailFilterItems = []
  usernameFilterItems = []

  listOfColumns: ColumnItem[] = [];
  listOfData: DataItem[] = [];
  visible: boolean = true;
  searchValue: string = '';

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.listOfData = [
      {
        firstName: 'John2',
        lastName: 'Brownc',
        email: 'john@brown.com',
        username:'johnBrown9'
      },    {
        firstName: 'John',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown99'
      },    {
        firstName: 'John4',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown699'
      },    {
        firstName: 'John',
        lastName: 'Brown5',
        email: 'john@brown.com',
        username:'johnBrown909'
      },    {
        firstName: 'John',
        lastName: 'Brow7',
        email: 'john@brown8.com',
        username:'johnBrown999'
      },    {
        firstName: 'John',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown99'
      },    {
        firstName: 'John4',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown699'
      },    {
        firstName: 'John',
        lastName: 'Brown5',
        email: 'john@brown.com',
        username:'johnBrown909'
      },    {
        firstName: 'John',
        lastName: 'Brow7',
        email: 'john@brown8.com',
        username:'johnBrown999'
      },    {
        firstName: 'John',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown99'
      },    {
        firstName: 'John4',
        lastName: 'Brown',
        email: 'john@brown.com',
        username:'johnBrown699'
      },    {
        firstName: 'John',
        lastName: 'Brown5',
        email: 'john@brown.com',
        username:'johnBrown909'
      },    {
        firstName: 'John',
        lastName: 'Brow7',
        email: 'john@brown8.com',
        username:'johnBrown999'
      },

    ];

    const filteredFirstNameData = [...new Set(this.listOfData.map(e => {
      return e.firstName
    }))]

   this.firstNameFilterItems = filteredFirstNameData.map(e => {
      return {
        text: e,
        value: e
      }
    })

    const filteredLastNameData = [...new Set(this.listOfData.map(e => {
      return e.lastName
    }))]

    this.lastNameFilterItems = filteredLastNameData.map(e => {
      return {
        text: e,
        value: e
      }
    })

    const filteredEmailData = [...new Set(this.listOfData.map(e => {
      return e.email
    }))]

    this.emailFilterItems = filteredEmailData.map(e => {
      return {
        text: e,
        value: e
      }
    })

    const filteredUserNameData = [...new Set(this.listOfData.map(e => {
      return e.username
    }))]

    this.usernameFilterItems = filteredUserNameData.map(e => {
      return {
        text: e,
        value: e
      }
    })

    this.listOfColumns= [
      {
        name: 'First Name',
        sortOrder: null,
        sortFn: (a: DataItem, b: DataItem) => a.firstName.localeCompare(b.firstName),
        filterMultiple: true,
        listOfFilter: this.firstNameFilterItems,
        filterFn: (list: string[], item: DataItem) => list.some(firstName => item.firstName.indexOf(firstName) !== -1)
      },
      {
        name: 'Last Name',
        sortOrder: null,
        sortFn: (a: DataItem, b: DataItem) => a.lastName.localeCompare(b.lastName),
        filterMultiple: true,
        listOfFilter: this.lastNameFilterItems,
        filterFn: (list: string[], item: DataItem) => list.some(lastName => item.lastName.indexOf(lastName) !== -1)
      },
      {
        name: 'Email',
        sortOrder: 'descend',
        sortFn: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email),
        filterMultiple: true,
        listOfFilter: this.emailFilterItems,
        filterFn: (list: string[], item: DataItem) => list.some(email => item.email.indexOf(email) !== -1)
      },
      {
        name: 'Username',
        sortOrder: null,
        sortFn: (a: DataItem, b: DataItem) => a.username.length - b.username.length,
        filterMultiple: false,
        listOfFilter:this.usernameFilterItems,
        filterFn: (username: string, item: DataItem) => item.username.indexOf(username) !== -1
      }
    ]
  }


  search() {

  }

  reset() {

  }
}


interface DataItem {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
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

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


  listOfColumns = {first_name: 'First Name', last_name: 'Last Name', username: 'Username', email: 'Email'};
  listOfData: StaffList[] = [];
  originalListOfData: StaffList[] = [];
  visible = {
    first_name: false, last_name: false, username: false, email: false
  };
  searchValue = {
    first_name: '', last_name: '', username: '', email: ''
  };


  constructor(private cdr: ChangeDetectorRef, private staffSer: StaffService) {
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

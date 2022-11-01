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


  listOfColumns = ['First Name', 'Last Name', 'Username', 'Email'];
  listOfData: StaffList[] = [];
  visible: boolean = true;
  searchValue = '';


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

  }

  reset() {
    this.searchValue = '';
    this.search();
  }

  search() {
    this.visible = false;
    this.listOfData = this.listOfData.filter((item: StaffList) => item.first_name.indexOf(this.searchValue) !== -1);
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

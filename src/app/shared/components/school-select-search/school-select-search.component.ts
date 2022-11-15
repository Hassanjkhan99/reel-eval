import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {Schools} from "../../interfaces/school.interface";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-school-select-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule],
  templateUrl: './school-select-search.component.html',
  styleUrls: ['./school-select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolSelectSearchComponent implements OnInit {
  @Output() selectionChange: EventEmitter<Schools> = new EventEmitter<Schools>()
  inputList: Schools[] = [];
  selectedValue: Schools;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  itemSelected() {
    this.selectionChange.emit(this.selectedValue)
  }

  search(searchValue: string) {
    console.log({searchValue})
    this.prospectSer.getSchools(searchValue).subscribe(schools => {
      this.inputList = schools
      this.cdr.detectChanges()
    })
  }
}

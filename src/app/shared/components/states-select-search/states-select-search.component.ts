import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {States} from "../../interfaces/state.interface";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-states-select-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule],
  templateUrl: './states-select-search.component.html',
  styleUrls: ['./states-select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatesSelectSearchComponent implements OnInit {
  @Output() selectionChange: EventEmitter<States> = new EventEmitter<States>()
  inputList: States[] = [];
  selectedValue: States;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }


  ngOnInit(): void {

  }

  itemSelected() {
    this.selectionChange.emit(this.selectedValue)
  }

  search(searchValue: string) {
    console.log({searchValue})
    this.prospectSer.getStates(searchValue).subscribe(states => {
      this.inputList = states
      this.cdr.detectChanges()
    })

  }

}

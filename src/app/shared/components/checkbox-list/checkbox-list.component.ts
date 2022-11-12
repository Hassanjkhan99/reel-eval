import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {FormsModule} from "@angular/forms";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@Component({
  selector: 'app-checkbox-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NzMenuModule, NzCheckboxModule],
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
})
export class CheckboxListComponent implements OnChanges {

  @Output() listChanged: EventEmitter<ListInterface[]> = new EventEmitter<ListInterface[]>()
  @Input() inputList: ListInterface[] = []
  selectionList: CheckedListInterface[] = []
  selections: ListInterface[] = [];


  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectionList = this.inputList.map(e => {
      return {
        ...e, checked: false
      }
    })
    this.cdr.detectChanges()
  }


  itemSelected() {
    this.selections = this.selectionList.filter(e => e.checked).map(e => {
      return {
        name: e.name, id: e.id
      }
    })

    this.listChanged.emit(this.selections)
  }
}

export interface ListInterface {
  name: string,
  id?: string | number
}

export interface CheckedListInterface extends ListInterface {
  checked: boolean
}

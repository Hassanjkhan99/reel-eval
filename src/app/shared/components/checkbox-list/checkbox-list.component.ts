import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {FormsModule} from "@angular/forms";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-checkbox-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NzMenuModule, NzCheckboxModule, NzSelectModule],
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
})
export class CheckboxListComponent {

  @Output() selectionChange: EventEmitter<ListInterface> = new EventEmitter<ListInterface>()
  @Input() inputList: ListInterface[] = [];
  @Input() name: string = '';

  selectedValue: ListInterface;


  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  itemSelected() {
    this.selectionChange.emit(this.selectedValue)
  }
}

export interface ListInterface {
  name: string,
  id?: string | number
}

export interface CheckedListInterface extends ListInterface {
  checked: boolean
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Positions} from "../../interfaces/positions.interface";
import {ProspectService} from "../../services/prospect.service";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@Component({
  selector: 'app-position-multi-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule, FormsModule, NzMenuModule, NzCheckboxModule],
  templateUrl: './position-multi-select.component.html',
  styleUrls: ['./position-multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionMultiSelectComponent implements OnInit {

  positions: Positions[] = []

  @Input() selectedPosition: Positions;

  @Output() positionsChanged: EventEmitter<Positions> = new EventEmitter<Positions>()

  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions
      this.cdr.detectChanges()
    })

  }

  positionSelected() {
    this.positionsChanged.emit(this.selectedPosition)
  }


}


export interface PositionCheckedInterface extends Positions {
  checked: boolean
}

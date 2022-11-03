import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ProspectService} from "../../services/prospect.service";
import {Positions} from "../../interfaces/positions.interface";
import {NzGridModule} from "ng-zorro-antd/grid";

@Component({
  selector: 'app-positions-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, ReactiveFormsModule, NzGridModule],
  templateUrl: './positions-select.component.html',
  styleUrls: ['./positions-select.component.scss'],
})
export class PositionsSelectComponent implements OnInit {

  positions: any[] = []
  position: FormControl = new FormControl<number>(-1)

  @Input() selectedPosition: number;
  @Output() positionChanged: EventEmitter<Positions> = new EventEmitter<Positions>()

  constructor(private prospectService: ProspectService) {
  }

  ngOnInit(): void {
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions.map(e => {
        return {
          id: e.id.toString(), position_name: e.position_name
        }
      })
      this.setValue();
    })
    this.position.valueChanges.subscribe(e => {
      this.emitPosition(e)
    })
  }



  emitPosition(id) {
    console.log(this.positions.find(e => e.id == id))
    this.positionChanged.emit(this.positions.find(e => e.id == id))
  }

  setValue() {
    if (!this.selectedPosition) return
    this.position.setValue(this.selectedPosition.toString() ?? '1');
  }
}

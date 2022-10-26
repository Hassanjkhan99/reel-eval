import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ProspectService} from "../../services/prospect.service";
import {Positions} from "../../interfaces/positions.interface";

@Component({
  selector: 'app-positions-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule],
  templateUrl: './positions-select.component.html',
  styleUrls: ['./positions-select.component.scss'],
})
export class PositionsSelectComponent implements OnInit {
  @Input() selectedPosition: number;
  positions: Positions[] = []
  @Output() positionChanged: EventEmitter<Positions> = new EventEmitter<Positions>()

  constructor(private prospectService: ProspectService) {
  }

  ngOnInit(): void {
    console.log(this.selectedPosition)
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions
      console.log(this.positions)
    })
  }

  emitPosition(id) {
    console.log(this.selectedPosition)
    this.positionChanged.emit(this.positions.find(e => e.id == this.selectedPosition))
  }
}

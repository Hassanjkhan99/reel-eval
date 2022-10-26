import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ProspectService} from "../../services/prospect.service";
import {Positions} from "../../interfaces/positions.interface";

@Component({
  selector: 'app-positions-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './positions-select.component.html',
  styleUrls: ['./positions-select.component.scss'],
})
export class PositionsSelectComponent implements OnInit, OnChanges {
  @Input() selectedPosition: number;
  positions: Positions[] = []
  @Output() positionChanged: EventEmitter<Positions> = new EventEmitter<Positions>()
  position: FormControl

  constructor(private prospectService: ProspectService) {
  }

  ngOnInit(): void {


    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions
      console.log(this.positions)
    })
    this.position.valueChanges.subscribe(e => {
      this.emitPosition(e)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedPosition)
    this.position = new FormControl<number>(this.selectedPosition)
  }

  emitPosition(id) {
    console.log(this.selectedPosition)
    this.positionChanged.emit(this.positions.find(e => e.id == this.selectedPosition))
  }
}

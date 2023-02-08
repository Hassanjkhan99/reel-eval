import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {Position, Prospect} from "../../../../shared/interfaces/report";

@Component({
  selector: 'app-prospect-list',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzIconModule],
  templateUrl: './prospect-list.component.html',
  styleUrls: ['./prospect-list.component.scss'],
})
export class ProspectListComponent implements OnInit {
  prospectsIdsList: number[] = []
  positionIdsList: number[] = []
  @Input() prospect: ProspectWithScore;

  _selectedProspects: { id: number, position: number }[] = [];

  get selectedProspects(): { id: number, position: number }[] {
    return this._selectedProspects;
  }

  @Input() set selectedProspects(value: { id: number, position: number }[]) {
    this.prospectsIdsList = value.map(e => e.id)
    this.positionIdsList = value.map(e => e.position)
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedProspects) {

    }
  }

}

export interface ProspectWithScore extends Prospect {
  iga_score: number;
  score: number;
  position: Position
}

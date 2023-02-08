import {Component, Input, OnInit} from '@angular/core';
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
  @Input() prospect: ProspectWithScore;
  @Input() selectedProspects: { id: number, position: number }[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {

  }

}

export interface ProspectWithScore extends Prospect {
  iga_score: number;
  score: number;
  position: Position
}

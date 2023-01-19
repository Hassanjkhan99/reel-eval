import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzIconModule} from "ng-zorro-antd/icon";
import {Prospect} from "../../../../shared/interfaces/report";

@Component({
  selector: 'app-prospect-list',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzIconModule],
  templateUrl: './prospect-list.component.html',
  styleUrls: ['./prospect-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProspectListComponent implements OnInit {
  @Input() prospectList: Prospect;
  @Input() prospectScore: number;

  constructor() {
  }

  ngOnInit(): void {
  }

}

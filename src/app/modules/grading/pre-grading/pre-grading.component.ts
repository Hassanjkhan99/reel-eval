import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsSelectComponent} from "../../../shared/components/positions-select/positions-select.component";
import {FormControl} from "@angular/forms";
import {Positions} from "../../../shared/interfaces/positions.interface";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzListModule} from "ng-zorro-antd/list";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTagModule} from "ng-zorro-antd/tag";
import {PillComponent} from "./pill/pill.component";
import {TraitsService} from "../../../shared/services/traits.service";
import {Trait} from "../../../shared/interfaces/trait";

@Component({
  selector: 'app-pre-grading',
  standalone: true,
  imports: [CommonModule, PositionsSelectComponent, NzGridModule, NzListModule, NzCardModule, NzTagModule, PillComponent],
  templateUrl: './pre-grading.component.html',
  styleUrls: ['./pre-grading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreGradingComponent implements OnInit {

  unSelectedTraits: Trait[] = [];

  selectedPosition = new FormControl<Positions>(null)

  constructor(private traitsService: TraitsService,) {
  }

  ngOnInit(): void {
    this.traitsService
      .getAllTraits(0, 1000, null, null, null)
      .subscribe((traits) => {
        this.unSelectedTraits = traits.results;
      });
  }


  onClose() {

  }
}

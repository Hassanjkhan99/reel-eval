import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsSelectComponent} from "../../../shared/components/positions-select/positions-select.component";
import {FormControl} from "@angular/forms";
import {Positions} from "../../../shared/interfaces/positions.interface";

@Component({
  selector: 'app-pre-grading',
  standalone: true,
  imports: [CommonModule, PositionsSelectComponent],
  templateUrl: './pre-grading.component.html',
  styleUrls: ['./pre-grading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreGradingComponent implements OnInit {

  selectedPosition = new FormControl<Positions>(null)

  constructor() {
  }

  ngOnInit(): void {
  }


}

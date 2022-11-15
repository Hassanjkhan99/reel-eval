import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-state-multi-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-multi-select.component.html',
  styleUrls: ['./state-multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMultiSelectComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}

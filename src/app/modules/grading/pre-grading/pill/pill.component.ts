import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconTestModule} from "ng-zorro-antd/icon/testing";
import {Trait} from "../../../../shared/interfaces/trait";

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule, NzIconTestModule],
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent implements OnInit {

  @Input() item: Trait
  @Input() selectedList: boolean = false;
  @Input() disabled: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  vibrateDiv(div: HTMLDivElement) {
    div.classList.add('vibrate')

    setTimeout(() => {
      div.classList.remove('vibrate')
    }, 1000)
  }
}

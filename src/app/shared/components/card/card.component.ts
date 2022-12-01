import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzCardModule} from "ng-zorro-antd/card";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  @Input() headerText = '';
  @Input() headerSubText = ''
  @Input() type: 'inner' | 'default' = 'inner'
  @Input() padding = '5px'
  @Input() margin = ''

  constructor() {
  }

  ngOnInit(): void {
  }

}

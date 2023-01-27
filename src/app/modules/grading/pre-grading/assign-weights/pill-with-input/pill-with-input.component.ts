import {Component, Input, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {ReactiveFormsModule,} from '@angular/forms';
import {TraitByPos} from '../../../../../shared/interfaces/trait';
import {UntilDestroy} from '@ngneat/until-destroy';
import {DragDropModule} from "@angular/cdk/drag-drop";

@UntilDestroy()
@Component({
  selector: 'app-pill-with-input',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    NzGridModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  templateUrl: './pill-with-input.component.html',
  styleUrls: ['./pill-with-input.component.scss'],
})
export class PillWithInputComponent
  implements OnInit {
  @Input() item: TraitByPos;

  ngOnInit(): void {
  }

}

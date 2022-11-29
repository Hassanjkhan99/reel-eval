import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait} from '../../../../shared/interfaces/trait';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {PillWithInputComponent} from './pill-with-input/pill-with-input.component';
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-assign-weights',
  standalone: true,
  imports: [
    CommonModule,
    PillWithInputComponent,
    NzGridModule,
    NzListModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
  templateUrl: './assign-weights.component.html',
  styleUrls: ['./assign-weights.component.scss'],
})
export class AssignWeightsComponent implements OnInit, OnChanges {
  @Input() list: Trait[] = [];
  @Input() traits: FormGroup = new FormGroup({});
  remainingValue = 0;
  total = 100;
  isLimitReached = false;

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.traits.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      const currValue: number = Object.values(value).reduce((prev, curr) => +prev + +curr, 0) as number;
      this.remainingValue = this.total - currValue;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }
}

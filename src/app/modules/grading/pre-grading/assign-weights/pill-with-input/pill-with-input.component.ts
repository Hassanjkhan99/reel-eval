import {ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule,} from '@angular/forms';
import {Trait} from '../../../../../shared/interfaces/trait';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PillWithInputComponent),
      multi: true,
    },
  ],
})
export class PillWithInputComponent
  implements OnInit, ControlValueAccessor, OnChanges {
  @Input() item: Trait;
  @Input() remainingLimit: number;
  control = new FormControl<number>(0);

  prevValue = 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  get value(): number {
    return this.control.value;
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value > this.prevValue + this.remainingLimit) {
        this.control.setValue(this.prevValue, {emitEvent: false});
      } else {
        this.prevValue = value;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.remainingLimit) {
      this.prevValue = this.control.value;
    }
  }

  registerOnChange(fn: (val: number) => unknown): void {
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      fn(value);
    });
  }

  registerOnTouched(fn: any): void {
    this.control.statusChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      fn(value);
    });
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(val: number): Promise<void> {
    if (val) {
      this.control.setValue(val);
      this.cdr.detectChanges();
    } else {
      this.control.reset(0);
    }
  }
}

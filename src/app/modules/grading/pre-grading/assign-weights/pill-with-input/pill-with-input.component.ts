import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzGridModule} from "ng-zorro-antd/grid";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {Trait} from "../../../../../shared/interfaces/trait";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-pill-with-input',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzInputModule, NzGridModule, ReactiveFormsModule],
  templateUrl: './pill-with-input.component.html',
  styleUrls: ['./pill-with-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PillWithInputComponent),
    multi: true,
  }],
})
export class PillWithInputComponent implements OnInit, ControlValueAccessor {

  @Input() item: Trait
  @Input() isLimitReached: boolean = false
  control = new FormControl<number>(null);


  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: (val: number) => unknown): void {
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (this.isLimitReached) {
        console.log({'limit': this.isLimitReached})
        this.control.disable({emitEvent: false});
      }
      if (value > 100) {
        fn(100);
      } else if (value < 0) {
        fn(0);
      } else {
        fn(value);
      }
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
      this.control.reset();
    }
  }

}

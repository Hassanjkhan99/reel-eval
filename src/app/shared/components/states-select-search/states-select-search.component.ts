import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from '../../services/prospect.service';
import {States} from '../../interfaces/state.interface';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule,} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-states-select-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './states-select-search.component.html',
  styleUrls: ['./states-select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatesSelectSearchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatesSelectSearchComponent
  implements OnInit, ControlValueAccessor {
  list: States[] = [];
  control = new FormControl<string>(null);

  constructor(
    private prospectSer: ProspectService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  async search(searchValue: string) {
    console.log({searchValue});
    this.list = await this.prospectSer.getStates(searchValue).toPromise();
    this.cdr.detectChanges();
  }

  registerOnChange(fn: (val: unknown) => unknown): void {
    this.control.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        console.log('registerOnChange: ', value)
        fn(value);
      });
  }

  registerOnTouched(fn: (val) => unknown): void {
    this.control.statusChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        fn(value);
      });
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(state: string): Promise<void> {
    await this.search(state);
    console.log('writeValue: ', state)
    this.control.setValue(state)
  }
}

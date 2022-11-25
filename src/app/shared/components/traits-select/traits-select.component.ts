import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TraitsService} from "../../services/traits.service";
import {Trait} from "../../interfaces/trait";
import {NzSelectModule} from "ng-zorro-antd/select";

@UntilDestroy()
@Component({
  selector: 'app-traits-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './traits-select.component.html',
  styleUrls: ['./traits-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TraitsSelectComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraitsSelectComponent implements OnInit, ControlValueAccessor {
  traitsList: Trait[] = [];
  control = new FormControl<string>(null)

  constructor(private traitsService: TraitsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  search(searchValue: string) {
    if (searchValue === '') {
      this.traitsList = []
      return
    }
    this.traitsService.getTraitsSearch(searchValue).subscribe(trait => {
      this.traitsList = trait
      this.cdr.detectChanges();
    })
  }

  registerOnChange(fn: (val: string) => unknown): void {
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      fn(value)
    })
  }

  registerOnTouched(fn: any): void {
    this.control.statusChanges.pipe(untilDestroyed(this)).subscribe(value => {
      fn(value)
    })
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(val: string): Promise<void> {
    await this.search(val)
    this.control.setValue(val);
    console.log(this.control)
    this.cdr.detectChanges()
  }

}

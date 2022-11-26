import {ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
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
})
export class TraitsSelectComponent implements OnInit, ControlValueAccessor {
  traitsList: Trait[] = [];
  control = new FormControl<Trait>(null);
  searchValue = ''
  @Input() blacklistItems: Trait[] = []

  constructor(private traitsService: TraitsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  search(searchValue: string) {
    this.searchValue = searchValue
    if (searchValue === '') {
      this.traitsList = []
      return
    }
    this.traitsService.getTraitsSearch(searchValue).subscribe(traits => {
      this.traitsList = traits.filter(trait => this.isItemExist(trait))
      console.log(traits.filter(trait => this.isItemExist(trait)));
      this.cdr.detectChanges();
    })
  }

  registerOnChange(fn: (val: Trait) => unknown): void {
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

  async writeValue(val: Trait): Promise<void> {
    if (val) {
      await this.search(val.trait)
      this.control.setValue(val);
      console.log(this.control)
      this.cdr.detectChanges()
    } else {
      this.control.reset();
    }

  }

  isItemExist(item: Trait) {
    console.log(this.blacklistItems)
    return this.blacklistItems.includes(item)
  }

}

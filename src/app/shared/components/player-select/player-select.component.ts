import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {NzSelectModule} from "ng-zorro-antd/select";
import {
  ControlValueAccessor,
  FormControl,
  FormControlStatus,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Prospect} from "../../interfaces/prospect.interface";

@UntilDestroy()
@Component({
  selector: 'app-player-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './player-select.component.html',
  styleUrls: ['./player-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PlayerSelectComponent),
    multi: true,
  }],
})
export class PlayerSelectComponent implements OnInit, ControlValueAccessor {

  prospectList: Prospect[] = [];
  control = new FormControl<string>(null)

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }


  search(searchValue: string) {
    if (searchValue === '') {
      this.prospectList = []
      return
    }
    this.prospectSer.getProspects(0, 1000, null, null, searchValue, 'first_name').subscribe(prospects => {
      this.prospectList = prospects.results
      this.cdr.detectChanges();
    })
  }

  registerOnChange(fn: (val: string) => unknown): void {
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      fn(value)
    })
  }

  registerOnTouched(fn: (val: FormControlStatus) => unknown): void {
    this.control.statusChanges.pipe(untilDestroyed(this)).subscribe(value => {
      fn(value)
    })
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(val: string): Promise<void> {
    await this.search(val)
    this.control.reset(val)
  }

}

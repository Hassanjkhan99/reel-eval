import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectService} from "../../services/prospect.service";
import {Schools} from "../../interfaces/school.interface";
import {
  ControlValueAccessor,
  FormControl,
  FormControlStatus,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-school-select-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './school-select-search.component.html',
  styleUrls: ['./school-select-search.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SchoolSelectSearchComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolSelectSearchComponent implements OnInit, ControlValueAccessor {
  schoolsList: Schools[] = [];
  control = new FormControl<string>(null)

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }


  search(searchValue: string) {
    if (searchValue === '') {
      this.schoolsList = []
      return
    }
    this.prospectSer.getSchools(searchValue).subscribe(schools => {
      this.schoolsList = schools
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

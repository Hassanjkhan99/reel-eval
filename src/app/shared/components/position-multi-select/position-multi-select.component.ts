import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormControlStatus,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import {Positions} from "../../interfaces/positions.interface";
import {ProspectService} from "../../services/prospect.service";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-position-multi-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule, FormsModule, NzMenuModule, NzCheckboxModule],
  templateUrl: './position-multi-select.component.html',
  styleUrls: ['./position-multi-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PositionMultiSelectComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionMultiSelectComponent implements OnInit, ControlValueAccessor {

  positions: Positions[] = []
  control = new FormControl<string>(null)

  @Input() selectedPosition: Positions;

  @Output() positionsChanged: EventEmitter<Positions> = new EventEmitter<Positions>()

  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions
      this.cdr.detectChanges()
    })

  }

  positionSelected() {
    this.positionsChanged.emit(this.selectedPosition)
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

  }

}

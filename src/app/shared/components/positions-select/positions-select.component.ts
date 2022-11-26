import {ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  FormControlStatus,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ProspectService} from "../../services/prospect.service";
import {Positions} from "../../interfaces/positions.interface";
import {NzGridModule} from "ng-zorro-antd/grid";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-positions-select',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, ReactiveFormsModule, NzGridModule],
  templateUrl: './positions-select.component.html',
  styleUrls: ['./positions-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PositionsSelectComponent),
    multi: true,
  }],
})
export class PositionsSelectComponent implements OnInit, ControlValueAccessor {

  positions: Positions[] = []
  position: FormControl = new FormControl<number>(null)

  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.prospectService.getPositions().subscribe(positions => {
      this.positions = positions.map(e => {
        return {
          id: e.id, position_name: e.position_name
        }
      })
      this.cdr.detectChanges()
    })

  }

  registerOnChange(fn: (val: Positions) => unknown): void {
    this.position.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      console.log({value})
      const position = this.positions.find(({id}) => id === value)
      fn(position)
    })
  }

  registerOnTouched(fn: (val: FormControlStatus) => unknown): void {
    this.position.statusChanges.pipe(untilDestroyed(this)).subscribe(value => {
      console.log(this.position.value)
      fn(value)
    })
  }

  setDisabledState(isDisabled: boolean): void {
  }

  async writeValue(val: Positions): Promise<void> {
    console.log(this.position.value)
    this.position.setValue(val.id);
    console.log(this.position.value)
    console.log(this.positions)
    this.cdr.detectChanges()
  }
}

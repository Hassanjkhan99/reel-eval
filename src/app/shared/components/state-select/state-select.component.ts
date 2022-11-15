import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Schools} from "../../interfaces/school.interface";
import {ProspectService} from "../../services/prospect.service";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-state-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './state-select.component.html',
  styleUrls: ['./state-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateSelectComponent implements OnInit {

  states: any[] = []
  state: FormControl = new FormControl<string>('')

  @Input() selectedState: string;
  @Output() stateChanged: EventEmitter<Schools> = new EventEmitter<Schools>()

  constructor(private prospectService: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.prospectService.getStates().subscribe(states => {
      this.states = states.map(e => {
        return {
          id: e.id.toString(), state_name: e.state_name
        }
      })
      this.setValue();
      this.cdr.detectChanges()
    })
    this.state.valueChanges.subscribe(e => {
      this.emitSchool(e)
    })
  }


  emitSchool(state_name) {
    console.log(this.states.find(e => e.state_name == state_name))
    if (!this.states.includes(this.selectedState.toString())) {
      return
    }
    this.stateChanged.emit(this.states.find(e => e.state_name == state_name))
  }

  setValue() {
    if (!this.selectedState) return
    if (!this.states.includes(this.selectedState.toString())) {
      return
    }
    this.state.setValue(this.selectedState.toString() ?? '1');
  }

}

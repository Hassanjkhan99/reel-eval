import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait} from '../../../../shared/interfaces/trait';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzListModule} from "ng-zorro-antd/list";
import {PillWithInputComponent} from "./pill-with-input/pill-with-input.component";

@Component({
  selector: 'app-assign-weights',
  standalone: true,
  imports: [CommonModule, PillWithInputComponent, NzGridModule, NzListModule, ReactiveFormsModule],
  templateUrl: './assign-weights.component.html',
  styleUrls: ['./assign-weights.component.scss'],
})
export class AssignWeightsComponent implements OnInit, OnChanges {
  @Input() list: Trait[] = [];
  @Input() traits: FormGroup = new FormGroup({})
  remainingValue: number = 0
  total: number = 0
  isLimitReached = false

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.traits.valueChanges.subscribe(e => {
      let sum = 0;
      for (const traitsKey in this.traits.value) {
        console.log(this.traits.value[traitsKey])
        console.log(traitsKey)
        sum += this.traits.get(traitsKey).value
      }
      this.remainingValue = 100 - sum;
      this.total = sum;
      this.isLimitReached = this.total >= 100
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


}

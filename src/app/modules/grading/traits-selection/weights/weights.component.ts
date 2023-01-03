import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait} from "../../../../shared/interfaces/trait";
import {Position} from "../../../../shared/interfaces/positions.interface";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NavigationExtras, Router} from "@angular/router";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NzListModule} from "ng-zorro-antd/list";
import {NzGridModule} from "ng-zorro-antd/grid";
import {InputComponent} from "./input/input.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {debounceTime} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: 'app-weights',
  standalone: true,
  imports: [CommonModule, NzListModule, NzGridModule, ReactiveFormsModule, InputComponent, NzButtonModule, DragDropModule],
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsComponent implements OnChanges, AfterViewInit {
  @Input() list: Trait[] = [];
  @Input() position: Position;
  @Input() traits: FormGroup = new FormGroup({});
  @Input() selectedChanged: number = null
  @Input() unSelectedChanged: number = null
  remainingValue = 100;
  total = 0;
  subArr: {} = {}

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.selectedChanged?.currentValue) {
      const fbName = changes.selectedChanged.currentValue.toString()
      this.subArr[fbName] = this.traits.get(fbName).valueChanges.pipe(distinctUntilChanged(), debounceTime(2000)).subscribe(e => {
        console.log(parseInt(fbName), e, this.position.id)
      })
    }
    if (changes?.unSelectedChanged?.currentValue) {
      const fbName = changes.unSelectedChanged.currentValue
      const sub = this.subArr[fbName]
      sub.unsubscribe()
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  ngAfterViewInit(): void {
    // this.traits.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
    //   const weights = this.traits.value
    //   // for (const weight in weights) {
    //   //  this.subArr.push(this.traits.get(weight).valueChanges.pipe(untilDestroyed(this)).subscribe(e =>{
    //   //    console.log(e);
    //   //   }))
    //   // }
    //   const currValue: number = Object.values(value).reduce(
    //     (prev, curr) => +prev + +curr,
    //     0
    //   ) as number;
    //   this.remainingValue = 100 - currValue;
    //   this.total = currValue;
    //   this.cdr.detectChanges()
    // });
  }

  submitWeights() {
    const queryParams: any = {};
    const list = this.list
    const position = this.position.id
    const navigationExtras: NavigationExtras = {
      queryParams
    };
  }

  ngOnInit(): void {
  }
}


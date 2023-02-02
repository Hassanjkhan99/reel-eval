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
import {Router} from "@angular/router";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NzListModule} from "ng-zorro-antd/list";
import {NzGridModule} from "ng-zorro-antd/grid";
import {InputComponent} from "./input/input.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {debounceTime} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {TraitsService} from "../../../../shared/services/traits.service";

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

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router, private traitsService: TraitsService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.selectedChanged?.currentValue) {
      const fbName = changes.selectedChanged.currentValue.toString()
      this.subArr[fbName] = this.traits.get(fbName).valueChanges.pipe(distinctUntilChanged(), debounceTime(3000)).subscribe(e => {
        const index = this.list.findIndex(trait => {
          return trait.id === parseInt(fbName)
        })
        if (e < 1) {
          return
        }
        if (!(this.traitsService.traitsArr.includes(parseInt(fbName)))) {
          this.traitsService.postTraitByPosition({
            order: index,
            trait: parseInt(fbName),
            position: this.position.id,
            weight: e / 100
          }).subscribe(e => {
            this.traitsService.traitsArr.push(parseInt(fbName));
          });
        } else {
          this.traitsService.editTraitByPosition({
            order: index,
            trait: parseInt(fbName),
            position: this.position.id,
            weight: e / 100
          }).subscribe(e => {
          });
        }

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
    this.list.forEach((trait, index) => {
      const weight = this.traits.get(trait.id.toString()).value
      if (!weight) {
        return
      }
      this.traitsService.editTraitByPosition({
        order: index,
        trait: trait.id,
        position: this.position.id,
        weight: weight / 100
      }).subscribe(e => {
      });
    })

  }

  ngAfterViewInit(): void {
    this.traits.valueChanges.pipe(untilDestroyed(this), debounceTime(10)).subscribe((value) => {
      console.log({value})
      const currValue: number = Object.values(value).reduce(
        (prev, curr) => +prev + +curr,
        0
      ) as number;
      this.remainingValue = 100 - currValue;
      this.total = currValue;
      this.cdr.detectChanges()
    });
  }

  submitWeights() {
    this.router.navigate(['/app/traits'])
  }

  ngOnInit(): void {
  }
}


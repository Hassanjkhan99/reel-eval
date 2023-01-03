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
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NzListModule} from "ng-zorro-antd/list";
import {NzGridModule} from "ng-zorro-antd/grid";
import {InputComponent} from "./input/input.component";
import {NzButtonModule} from "ng-zorro-antd/button";

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
  remainingValue = 100;
  total = 0;


  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  ngAfterViewInit(): void {
    this.traits.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
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
    const queryParams: any = {};
    const list = this.list
    const weights = this.traits.value
    console.log(weights)
    const position = this.position.id

    queryParams.traits = JSON.stringify(list);
    queryParams.positionSelected = JSON.stringify(position);
    queryParams.weightsSelected = JSON.stringify(weights);

    const navigationExtras: NavigationExtras = {
      queryParams
    };
    this.router.navigate(['/app/traits'])
  }

  ngOnInit(): void {
  }
}


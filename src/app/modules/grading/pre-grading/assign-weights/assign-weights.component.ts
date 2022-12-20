import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait} from '../../../../shared/interfaces/trait';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {PillWithInputComponent} from './pill-with-input/pill-with-input.component';
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {SharedModule} from "../../../../shared/shared.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NavigationExtras, Router, RouterLink} from "@angular/router";
import {Position} from "../../../../shared/interfaces/positions.interface";
import {Prospect} from "../../../../shared/interfaces/prospect.interface";

@UntilDestroy()
@Component({
  selector: 'app-assign-weights',
  standalone: true,
  imports: [
    CommonModule,
    PillWithInputComponent,
    NzGridModule,
    NzListModule,
    ReactiveFormsModule,
    DragDropModule,
    SharedModule,
    NzButtonModule,
    RouterLink,
  ],
  templateUrl: './assign-weights.component.html',
  styleUrls: ['./assign-weights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignWeightsComponent implements OnChanges, AfterViewInit {
  @Input() list: Trait[] = [];
  @Input() position: Position;
  @Input() prospect: Prospect;
  @Input() traits: FormGroup = new FormGroup({});
  remainingValue: number;
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

  startGrading() {
    const queryParams: any = {};
    const list = this.list.map(e => e.trait)
    const position = this.position.position_name
    const prospect = this.prospect
    console.log(prospect)
    console.log({list})
    queryParams.traits = JSON.stringify(list);
    queryParams.positionSelected = JSON.stringify(position);
    queryParams.prospectSelected = JSON.stringify(prospect);

    const navigationExtras: NavigationExtras = {
      queryParams
    };

    this.router.navigate(['/app/grading'], navigationExtras)
  }
}

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
import {TraitByPos} from '../../../../shared/interfaces/trait';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {PillWithInputComponent} from './pill-with-input/pill-with-input.component';
import {CdkDragDrop, DragDropModule, moveItemInArray,} from '@angular/cdk/drag-drop';
import {UntilDestroy} from '@ngneat/until-destroy';
import {SharedModule} from '../../../../shared/shared.module';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {Router, RouterLink} from '@angular/router';
import {Position} from '../../../../shared/interfaces/positions.interface';
import {LoadingService} from "../../../../shared/services/loading.service";
import {TraitsService} from "../../../../shared/services/traits.service";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignWeightsComponent implements OnChanges, AfterViewInit {
  @Input() list: TraitByPos[] = [];
  @Input() position: Position;
  @Input() total: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    public loadingService: LoadingService,
    private traitsService: TraitsService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngAfterViewInit(): void {
  }

  startGrading() {
    this.router.navigate(['/app/grading']);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    this.list.forEach((trait, index) => {
      this.traitsService.editTraitByPosition({
        order: index,
        trait: trait.trait,
        position: this.position.id,
        weight: trait.weight
      }).subscribe(e => {
      });
    })

  }
}

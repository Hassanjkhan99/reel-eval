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
import {DragDropModule,} from '@angular/cdk/drag-drop';
import {UntilDestroy} from '@ngneat/until-destroy';
import {SharedModule} from '../../../../shared/shared.module';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {Router, RouterLink} from '@angular/router';
import {Position} from '../../../../shared/interfaces/positions.interface';
import {Prospect} from '../../../../shared/interfaces/prospect.interface';
import {GradingService} from '../../../../shared/services/grading.service';
import {LoadingService} from "../../../../shared/services/loading.service";

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
  @Input() list: Trait[] = [];
  @Input() position: Position;
  @Input() prospect: Prospect;
  @Input() traits: FormGroup = new FormGroup({});
  @Input() selectedChanged: number = null;
  @Input() unSelectedChanged: number = null;
  @Input() total: number;
  @Input() remainingValue: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private gradingService: GradingService,
    public loadingService: LoadingService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngAfterViewInit(): void {
  }

  startGrading() {
    this.gradingService.selectedPosition = this.position;
    this.gradingService.selectedProspect = this.prospect;
    this.router.navigate(['/app/grading']);
  }
}

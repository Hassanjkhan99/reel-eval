import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {PillComponent} from './pill/pill.component';
import {TraitsService} from '../../../shared/services/traits.service';
import {TraitByPos} from '../../../shared/interfaces/trait';
import {TraitsSelectComponent} from '../../../shared/components/traits-select/traits-select.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AssignWeightsComponent} from "./assign-weights/assign-weights.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {Position} from "../../../shared/interfaces/positions.interface";
import {NotificationService} from "../../../shared/services/notification.service";
import {CardComponent} from "../../../shared/components/card/card.component";
import {PlayerSelectComponent} from "../../../shared/components/player-select/player-select.component";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {GradingService} from "../../../shared/services/grading.service";
import {NzSelectModule} from "ng-zorro-antd/select";

@UntilDestroy()
@Component({
  selector: 'app-pre-grading',
  standalone: true,
  imports: [
    CommonModule,
    PositionsSelectComponent,
    NzGridModule,
    NzListModule,
    NzCardModule,
    NzTagModule,
    PillComponent,
    TraitsSelectComponent,
    ReactiveFormsModule,
    AssignWeightsComponent,
    DragDropModule,
    CardComponent,
    PlayerSelectComponent,
    NzSelectModule,
  ],
  templateUrl: './pre-grading.component.html',
  styleUrls: ['./pre-grading.component.scss'],
})
export class PreGradingComponent implements OnInit {
  selectProspect = new FormControl<Prospect>(null);
  selectedPosition = new FormControl<Position>({value: null, disabled: true});
  total: number = 0;
  traits: TraitByPos[] = [];
  positions: Position[] = []

  constructor(private traitsService: TraitsService, private notificationService: NotificationService, private cdr: ChangeDetectorRef, private gradingService: GradingService) {
  }

  ngOnInit(): void {
    this.selectProspect.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        this.positions = []
        this.selectedPosition.reset()
        this.total = 0;
        this.traits = []
        if (value) {
          this.gradingService.selectedProspect = value
          this.selectedPosition.enable()
          this.positions = value.pos
        } else {
          this.selectedPosition.disable()
        }
      },
    })
    this.selectedPosition.valueChanges.pipe(untilDestroyed(this)).subscribe(
      x => {
        if (!x) {
          return
        }
        this.gradingService.selectedPosition = x
        this.traitsService.getTraitByPosition(this.selectedPosition.value.id).subscribe((e) => {
          this.total = parseInt((e.map(e => e.weight).reduce((prev, curr) => prev + curr, 0) * 100).toFixed(0));
          this.traits = e
          if (e.length > 0 && this.total < 100) {
            this.notificationService.error('Weights of assigned trait(s) does not equal 100');
          }
          this.cdr.detectChanges();

        });
      }
    )

  }

}

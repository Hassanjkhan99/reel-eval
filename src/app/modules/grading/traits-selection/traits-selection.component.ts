import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait} from '../../../shared/interfaces/trait';
import {FormControl, FormGroup} from '@angular/forms';
import {TraitsService} from '../../../shared/services/traits.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {PillComponent} from '../pre-grading/pill/pill.component';
import {CardComponent} from '../../../shared/components/card/card.component';
import {AssignWeightsComponent} from '../pre-grading/assign-weights/assign-weights.component';
import {ActivatedRoute} from '@angular/router';
import {Position} from "../../../shared/interfaces/prospect.interface";

@UntilDestroy()
@Component({
  selector: 'app-traits-selection',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzListModule,
    PillComponent,
    CardComponent,
    AssignWeightsComponent,
  ],
  templateUrl: './traits-selection.component.html',
  styleUrls: ['./traits-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraitsSelectionComponent implements OnInit {
  unSelectedTraits: Trait[] = [];
  selectedTraits: Trait[] = [];
  combinedArray: Trait[] = [];
  selectedPosition: Position
  selectedTrait = new FormControl<Trait>({value: null, disabled: true});
  traits: FormGroup = new FormGroup({});

  constructor(
    private traitsService: TraitsService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    let position = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('positionSelected'))
    this.selectedPosition = position;
    this.traitsService
      .getAllTraits(0, 1000, null, null, null)
      .pipe(untilDestroyed(this))
      .subscribe((traits) => {
        this.unSelectedTraits = traits.results;
        this.setCombinedArray();
        this.cdr.detectChanges();
      });
    this.selectedTrait.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        this.selectItem(value);
        this.selectedTrait.setValue(null, {emitEvent: false});
        this.setCombinedArray();
      },
    });
    this.cdr.detectChanges();
  }

  selectItem(item: Trait) {
    // if (!this.selectedPosition.value) {
    //   const isProspectSelected = !!this.selectProspect.value
    //   this.notificationService.error(`No ${isProspectSelected ? 'Position' : 'Prospect'} Selected`, `Please select a ${isProspectSelected ? 'position' : 'prospect'} first`);
    //   return;
    // }

    if (!this.selectedTraits.find((trait) => trait.id === item.id)) {
      this.selectedTraits.push(item);
    }
    this.unSelectedTraits.splice(
      this.unSelectedTraits.findIndex((trait) => trait.id === item.id),
      1
    );
    this.setCombinedArray();
    this.traits.setControl(
      item.id.toString(),
      new FormControl({value: 0, disabled: true})
    );
  }

  unSelectItem(item: Trait) {
    this.selectedTraits.splice(
      this.selectedTraits.findIndex((trait) => trait.id === item.id),
      1
    );
    this.unSelectedTraits.unshift(item);
    this.setCombinedArray();
    this.traits.removeControl(item.id.toString());
  }

  setCombinedArray() {
    this.combinedArray = [...this.selectedTraits, ...this.unSelectedTraits];
  }
}

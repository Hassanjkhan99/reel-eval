import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Trait, TraitByPos} from '../../../shared/interfaces/trait';
import {FormControl, FormGroup} from '@angular/forms';
import {TraitsService} from '../../../shared/services/traits.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {PillComponent} from '../pre-grading/pill/pill.component';
import {CardComponent} from '../../../shared/components/card/card.component';
import {ActivatedRoute} from '@angular/router';
import {Position} from '../../../shared/interfaces/prospect.interface';
import {WeightsComponent} from './weights/weights.component';

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
    WeightsComponent,
  ],
  templateUrl: './traits-selection.component.html',
  styleUrls: ['./traits-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraitsSelectionComponent implements OnInit {
  unSelectedTraits: Trait[] = [];
  selectedTraits: Trait[] = [];
  combinedArray: Trait[] = [];
  selectedPosition: Position;
  traitsByPosList: TraitByPos[];
  selectedTrait = new FormControl<Trait>({value: null, disabled: true});
  traits: FormGroup = new FormGroup({});
  selected: number = null;
  unselected: number = null;

  constructor(
    private traitsService: TraitsService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.traitsService.getTraitByPosition().subscribe((e) => {
      this.traitsByPosList = e.filter(
        (e) => e.position == this.selectedPosition.id
      );
      console.log(this.traitsByPosList);
      e.forEach(trait => {
        this.selectItem(trait.trait_obj)
      })
      this.cdr.detectChanges();
    });
    this.selectedPosition = JSON.parse(
      this.activatedRoute.snapshot.queryParamMap.get('positionSelected')
    );
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
    console.log(item);
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
    this.selected = item.id;
    this.cdr.detectChanges();
  }

  unSelectItem(item: Trait) {
    this.selectedTraits.splice(
      this.selectedTraits.findIndex((trait) => trait.id === item.id),
      1
    );
    this.unSelectedTraits.unshift(item);
    this.setCombinedArray();
    this.traits.removeControl(item.id.toString());
    this.unselected = item.id;
    this.cdr.detectChanges();
  }

  setCombinedArray() {
    this.combinedArray = [...this.selectedTraits, ...this.unSelectedTraits];
  }
}

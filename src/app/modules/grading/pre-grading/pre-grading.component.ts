import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {PillComponent} from './pill/pill.component';
import {TraitsService} from '../../../shared/services/traits.service';
import {Trait, TraitByPos} from '../../../shared/interfaces/trait';
import {TraitsSelectComponent} from '../../../shared/components/traits-select/traits-select.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AssignWeightsComponent} from "./assign-weights/assign-weights.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {Position} from "../../../shared/interfaces/positions.interface";
import {NotificationService} from "../../../shared/services/notification.service";
import {CardComponent} from "../../../shared/components/card/card.component";
import {PlayerSelectComponent} from "../../../shared/components/player-select/player-select.component";
import {Prospect} from "../../../shared/interfaces/prospect.interface";

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
  ],
  templateUrl: './pre-grading.component.html',
  styleUrls: ['./pre-grading.component.scss'],
})
export class PreGradingComponent implements OnInit {
  unSelectedTraits: Trait[] = [];
  selectedTraits: Trait[] = [];
  combinedArray: Trait[] = [];
  selected: number = null;
  unselected: number = null;
  selectedTrait = new FormControl<Trait>({value: null, disabled: true});
  selectedPosition = new FormControl<Position>({value: null, disabled: true});
  traits: FormGroup = new FormGroup({})
  selectProspect = new FormControl<Prospect>(null);
  private traitsByPosList: TraitByPos[];

  constructor(private traitsService: TraitsService, private notificationService: NotificationService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    // this.traitsService
    //   .getAllTraits(0, 1000, null, null, null)
    //   .pipe(untilDestroyed(this))
    //   .subscribe((traits) => {
    //     this.unSelectedTraits = traits.results;
    //     this.setCombinedArray()
    //   });
    this.selectedTrait.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        this.selectItem(value)
        this.selectedTrait.setValue(null, {emitEvent: false})
        // this.setCombinedArray()
      },
    });
    this.selectProspect.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        console.log({value})
        if (value) {
          this.selectedPosition.enable()
        } else {
          this.selectedPosition.disable()
        }
      },
    })
    this.selectedPosition.valueChanges.pipe(untilDestroyed(this)).subscribe(
      x => {
        this.traitsService.getTraitByPosition(this.selectedPosition.value.id).subscribe((e) => {
          this.traitsByPosList = [];
          this.selectedTraits = [];
          this.traitsService.traitsArr = []
          this.traitsByPosList = e
          console.log(this.traitsByPosList);
          this.traitsByPosList.forEach((trait) => {
            this.traitsService.traitsArr.push(trait.trait_obj.id);
            this.selectItem(trait.trait_obj, trait.weight * 100, trait.id);
          });
          this.cdr.detectChanges();

        });
      }
    )

  }

  onClose() {
  }

  selectItem(item: Trait, weight?: number, id?: number) {
    if (!this.selectedPosition.value) {
      const isProspectSelected = !!this.selectProspect.value
      this.notificationService.error(`No ${isProspectSelected ? 'Position' : 'Prospect'} Selected`, `Please select a ${isProspectSelected ? 'position' : 'prospect'} first`);
      return;
    }

    if (!this.selectedTraits.find((trait) => trait.id === item.id)) {
      this.selectedTraits.push(item);
    }
    // this.unSelectedTraits.splice(
    //   this.unSelectedTraits.findIndex((trait) => trait.id === item.id),
    //   1
    // );
    // this.setCombinedArray();
    this.traits.setControl(
      item.id.toString(),
      new FormControl({value: weight ? weight : 0, disabled: true})
    );
    console.log(this.traits.value)
    this.selected = item.id;
    this.cdr.detectChanges();
  }

  // setCombinedArray() {
  //   this.combinedArray = [...this.selectedTraits, ...this.unSelectedTraits]
  // }


}

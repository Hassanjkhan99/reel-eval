import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {PillComponent} from './pill/pill.component';
import {TraitsService} from '../../../shared/services/traits.service';
import {Trait} from '../../../shared/interfaces/trait';
import {TraitsSelectComponent} from '../../../shared/components/traits-select/traits-select.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AssignWeightsComponent} from "./assign-weights/assign-weights.component";
import {DragDropModule} from "@angular/cdk/drag-drop";

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
  ],
  templateUrl: './pre-grading.component.html',
  styleUrls: ['./pre-grading.component.scss'],
})
export class PreGradingComponent implements OnInit {
  unSelectedTraits: Trait[] = [];
  selectedTraits: Trait[] = [];
  combinedArray: Trait[] = [];

  selectedTrait = new FormControl<Trait>(null);
  traits: FormGroup = new FormGroup({})

  constructor(private traitsService: TraitsService) {
  }

  ngOnInit(): void {
    this.traitsService
      .getAllTraits(0, 1000, null, null, null)
      .subscribe((traits) => {
        this.unSelectedTraits = traits.results;
        this.setCombinedArray()
      });
    this.selectedTrait.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: (value) => {
        this.selectItem(value)
        this.selectedTrait.setValue(null, {emitEvent: false})
        this.setCombinedArray()
      },
    });
  }

  onClose() {
  }

  selectItem(item: Trait) {
    if (!this.selectedTraits.find((trait) => trait.id === item.id)) {
      this.selectedTraits.push(item);
    }
    this.unSelectedTraits.splice(
      this.unSelectedTraits.findIndex((trait) => trait.id === item.id),
      1
    );
    this.setCombinedArray()
    const traitId = item.id
    this.traits.setControl(item.id.toString(), new FormControl(0))
    console.log(this.traits.controls)
  }

  unSelectItem(item: Trait) {
    this.selectedTraits.splice(
      this.selectedTraits.findIndex((trait) => trait.id === item.id),
      1
    );
    this.unSelectedTraits.unshift(item)
    this.setCombinedArray()
    this.traits.removeControl(item.id.toString())
  }

  setCombinedArray() {
    this.combinedArray = [...this.selectedTraits, ...this.unSelectedTraits]
  }

}

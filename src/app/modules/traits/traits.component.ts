import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TraitsService} from "../../shared/services/traits.service";
import {NzListModule} from "ng-zorro-antd/list";
import {Traits} from "../../shared/interfaces/traits";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-traits',
  standalone: true,
  imports: [CommonModule, NzListModule, NzGridModule, NzButtonModule, NzInputModule, NzIconModule],
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
})
export class TraitsComponent implements OnInit {
  unSelectedTraits: Traits[] = [];
  selectedTraits: Traits[] = []
  showRow: boolean = false;

  constructor(private traitsService: TraitsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.traitsService.getAllTraits().subscribe(traits => {
      this.unSelectedTraits = traits
    })
  }

  traitSelected(trait: Traits) {
    this.selectedTraits = [...this.selectedTraits, trait]
    const index = this.unSelectedTraits.findIndex(item => item.id === trait.id)
    this.unSelectedTraits.splice(index, 1);
    this.cdr.detectChanges()
  }

  traitUnSelected(trait: Traits) {
    this.unSelectedTraits = [...this.unSelectedTraits, trait]
    const index = this.unSelectedTraits.findIndex(item => item.id === trait.id)
    this.unSelectedTraits.splice(index, 1);
    this.cdr.detectChanges()
  }

  addNewTraitRow() {
    this.showRow = true
  }

  isSave() {

  }
}

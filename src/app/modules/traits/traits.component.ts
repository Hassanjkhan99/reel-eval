import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TraitsService} from "../../shared/services/traits.service";
import {NzListModule} from "ng-zorro-antd/list";
import {Traits} from "../../shared/interfaces/traits";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-traits',
  standalone: true,
  imports: [CommonModule, NzListModule, NzGridModule, NzButtonModule, NzInputModule, NzIconModule, NzTableModule, NzDividerModule, ReactiveFormsModule],
  templateUrl: './traits.component.html',
  styleUrls: ['./traits.component.scss'],
})
export class TraitsComponent implements OnInit {
  traits: Traits[] = [];
  showRow: boolean = false;
  traitForm = new FormGroup({
    trait: new FormControl(''),
    description: new FormControl('')
  })

  constructor(private traitsService: TraitsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.traitsService.getAllTraits().subscribe(traits => {
      this.traits = traits
    })
  }


  addNewTraitRow() {
    this.showRow = true
  }

  isSave() {

  }
}

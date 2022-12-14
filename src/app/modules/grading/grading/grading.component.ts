import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormArray} from "@angular/forms";

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule],
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GradingComponent implements OnInit {
  listOfColumns = ['Bend', 'Effort', 'Heavy Hands', 'Pad Level', 'Technique'];
  grading = new FormArray([])

  constructor() {
  }

  ngOnInit(): void {
    this.listOfColumns.map(col => {
    })
  }

}

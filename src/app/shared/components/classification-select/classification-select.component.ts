import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-classification-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, FormsModule],
  templateUrl: './classification-select.component.html',
  styleUrls: ['./classification-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassificationSelectComponent implements OnInit {
  listOfOption: string[] = [];
  listOfSelectedValue = [];

  constructor() {
  }

  ngOnInit(): void {
    const children: string[] = [];
    for (let i = 10; i < 36; i++) {
      children.push(`${i.toString(36)}${i}`);
    }
    this.listOfOption = children;

  }

}

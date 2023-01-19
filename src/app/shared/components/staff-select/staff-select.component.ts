import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-staff-select',
  standalone: true,
  imports: [CommonModule, NzSelectModule, FormsModule],
  templateUrl: './staff-select.component.html',
  styleUrls: ['./staff-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffSelectComponent implements OnInit {
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

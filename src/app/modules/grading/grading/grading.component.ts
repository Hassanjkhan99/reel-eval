import {ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule],
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss'],
})
export class GradingComponent implements OnInit {
  listOfColumns = ['Bend', 'Effort', 'Heavy Hands', 'Pad Level', 'Technique'];
  grading = [];
  columnValue = {};
  totalValue = 0

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.columnValue = this.listOfColumns.reduce(
      (a, v) => ({...a, [v]: 100}),
      {}
    );
    console.log(this.columnValue);
    this.addRow();
  }

  addRow() {
    const columnsWithValue = this.listOfColumns.reduce(
      (a, v) => ({...a, [v]: 100}),
      {}
    );
    let obj = {...columnsWithValue, rowNumber: this.grading.length + 1};

    this.grading = [...this.grading, obj];
    this.cdr.detectChanges();
    console.log(this.grading);
    this.listOfColumns.forEach((e) => {
      this.calculateColumn(e);
    });
  }

  removeRow(index: number) {
    if (this.grading.length < 2) {
      return;
    }
    this.grading = this.grading.filter((e, i) => i !== index);
    this.cdr.detectChanges();
    console.log(this.grading);
  }

  calculateColumn(columnName: string) {
    const value = this.grading.map((e) => {
      return e[columnName];
    });
    const length = value.length;
    this.columnValue[columnName] =
      value.reduce((prev, curr, i) => {
        return prev + curr;
      }) / length;
    console.log({value});
    this.calculateOverAll()
  }

  calculateOverAll() {
    let sum = 0
    for (const key in this.columnValue) {
      sum += this.columnValue[key]
    }
    this.totalValue = sum / this.listOfColumns.length
  }

  increment(column: string, i: number) {
    if (this.grading[i][column] > 99) {
      return;
    }
    this.grading[i][column]++;
    this.calculateColumn(column);
  }

  decrement(column: string, i: number) {
    if (this.grading[i][column] < 1) {
      return;
    }
    this.grading[i][column]--;
    this.calculateColumn(column);
  }


}

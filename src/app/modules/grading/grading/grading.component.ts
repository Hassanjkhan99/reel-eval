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
      (a, v) => ({...a, [v]: 0}),
      {}
    );
    console.log(this.columnValue);
    this.addRow();
  }

  addRow() {
    const columnsWithValue = this.listOfColumns.reduce(
      (a, v) => ({...a, [v]: 0}),
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
    const plus = []
    let minus = []
    this.grading.forEach(e => {
      if (e[columnName] > 0) {
        plus.push(e[columnName])
      }
      if (e[columnName] < 0) {
        minus.push(e[columnName])
      }
    })
    if (plus.length > 0 && minus.length > 0) {
      console.log(plus.length / minus.length)
    }

    // let value = this.grading.map((e) => {
    //   return e[columnName] * 100  ;
    // }).filter(e => e !== 0)
    // value = value.map(e => e/ value.length)
    // console.log({value})
    // const length = value.length;
    // this.columnValue[columnName] =
    //   value.reduce((prev, curr, i) => {
    //     return prev + curr;
    //   }) ;
    // console.log({value});
    // this.calculateOverAll()
  }

  calculateOverAll() {
    let sum = 0
    for (const key in this.columnValue) {
      sum += this.columnValue[key]
    }
    this.totalValue = sum / this.listOfColumns.length
  }

  increment(column: string, i: number) {
    if (this.grading[i][column] >= 1) {
      return;
    }
    this.grading[i][column]++;
    this.calculateColumn(column);
  }

  decrement(column: string, i: number) {
    if (this.grading[i][column] <= -1) {
      return;
    }
    this.grading[i][column]--;
    this.calculateColumn(column);
  }


}

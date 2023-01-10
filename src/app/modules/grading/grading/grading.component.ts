import {ChangeDetectorRef, Component, OnInit,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {ActivatedRoute, Router} from "@angular/router";
import {NzModalModule} from "ng-zorro-antd/modal";
import {GradingService} from "../../../shared/services/grading.service";
import {Position} from "../../../shared/interfaces/positions.interface";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {Trait} from "../../../shared/interfaces/grading";

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule, NzToolTipModule, NzModalModule],
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss'],
})
export class GradingComponent implements OnInit {
  listOfColumns: Trait[] = [];
  grading = [];
  weights = {}
  columnValue = {};
  totalValue = 0
  position = ''
  prospect = {
    first_name: '', last_name: '', classification: '', school: '', state: ''
  }
  isNeutral = {}
  today: number = Date.now();
  isVisible = false;
  isOkLoading = false;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute, private gradeService: GradingService) {

  }

  ngOnInit(): void {
    let traits = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('traits'))
    const selectedPosition: Position = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('positionSelected'))
    const selectedProspect: Prospect = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('prospectSelected'))
    const selectedWeights = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('weightsSelected'))
    this.position = selectedPosition.position_name;

    this.prospect = selectedProspect;
    this.weights = selectedWeights;

    traits.forEach(e => {
      this.isNeutral[e.trait] = true
    });

    this.gradeService.getPlays(selectedPosition.id, selectedProspect.id).subscribe(e => {
      this.listOfColumns = e.grade[0].grade.map(f => f.position_trait.trait)
      // this.columnValue = this.listOfColumns.reduce((a,v) => {})
      console.log(this.listOfColumns)
      console.log(e.overall_position_trait)
    })

    this.addRow();
  }

  addRow() {
    // const columnsWithValue = this.listOfColumns.reduce(
    //   (a, v) => ({...a, [v]: 0}),
    //   {}
    // );
    // let obj = {...columnsWithValue, rowNumber: this.grading.length + 1};

    // this.grading = [...this.grading, obj];
    // this.cdr.detectChanges();
    // this.listOfColumns.forEach((e) => {
    //   this.calculateColumn(e.trait);
    // });
    this.today = Date.now();
    this.cdr.detectChanges();
  }

  removeRow(index: number) {
    // if (this.grading.length < 2) {
    //   return;
    // }
    // this.grading = this.grading.filter((e, i) => i !== index);
    // this.listOfColumns.forEach((e) => {
    //   this.calculateColumn(e);
    // });
    // this.cdr.detectChanges();
    // this.today = Date.now();
    this.cdr.detectChanges();
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

    this.isNeutral[columnName] = !(plus.length + minus.length);
    if (isFinite((plus.length - minus.length) / (plus.length + minus.length))) {
      this.columnValue[columnName] = (plus.length) / (plus.length + minus.length) * 100
      console.log(this.columnValue[columnName] = (plus.length) / (plus.length + minus.length) * 100)
    } else {
      this.columnValue[columnName] = 0
    }
    this.today = Date.now();
    this.cdr.detectChanges();

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
    this.calculateOverAll()
  }

  calculateOverAll() {
    let sum = 0

    for (const key in this.columnValue) {
      console.log({key})
      sum += this.columnValue[key]
    }
    this.totalValue = sum / this.listOfColumns.length
  }

  increment(column: Trait, i: number) {
    if (this.grading[i][column.trait] >= 1) {
      this.grading[i][column.trait] = 1;
      return;
    } else {
      this.grading[i][column.trait]++;
    }
    this.calculateColumn(column.trait);
    this.today = Date.now();
    this.cdr.detectChanges();
  }

  decrement(column: Trait, i: number) {
    if (this.grading[i][column.trait] <= -1) {
      this.grading[i][column.trait] = -1;
    } else {
      this.grading[i][column.trait]--;
    }
    this.calculateColumn(column.trait);
    this.today = Date.now();
    this.cdr.detectChanges();
  }


  clear(i: number) {
    // const columnsWithValue = this.listOfColumns.reduce(
    //   (a, v) => ({...a, [v]: 0}),
    //   {}
    // );
    // let obj = {...columnsWithValue, rowNumber: this.grading[i].rowNumber};
    // this.grading[i] = obj;
    //
    // this.listOfColumns.forEach((e) => {
    //   this.calculateColumn(e);
    // });
    this.today = Date.now();
    this.cdr.detectChanges();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

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
import {Grade, Trait} from "../../../shared/interfaces/grading";

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule, NzToolTipModule, NzModalModule],
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss'],
})
export class GradingComponent implements OnInit {
  listOfColumns: Trait[] = [];
  grading: Grade[] = [];
  weights = {};
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
  private selectedPosition: Position;
  private selectedProspect: Prospect;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute, private gradeService: GradingService) {

  }

  ngOnInit(): void {
    let traits = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('traits'))
    this.selectedPosition = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('positionSelected'))
    this.selectedProspect = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('prospectSelected'))
    this.position = this.selectedPosition.position_name;

    this.prospect = this.selectedProspect;

    traits.forEach(e => {
      this.isNeutral[e.trait] = true
    });

    this.gradeService.getPlays(this.selectedPosition.id, this.selectedProspect.id).subscribe(response => {
      this.assignData(response)
    }, err => {
      this.addRow()
    })

  }

  addRow() {
    this.gradeService.createNewPlay(this.selectedPosition.id, this.selectedProspect.id).subscribe(response => {
      this.assignData(response)
    })
    this.cdr.detectChanges();
  }

  removeRow(playId: number) {

    this.today = Date.now();
    this.gradeService.deletePlays(playId).subscribe(e => {
      this.assignData(e);
    })
    this.cdr.detectChanges();
  }

  increment(column: any, i: number) {
    console.log(this.grading[i][column.score])
    if (column.score == null) {
      this.gradeService.incrementScore(column.id).subscribe(e => {
        this.assignData(e);
      })
    } else if (column.score == 0) {
      this.gradeService.neutralScore(column.id).subscribe(e => {
        this.assignData(e);
      })
    } else {
      return
    }
    this.cdr.detectChanges();

    console.log(column)
    console.log(i)
  }

  decrement(column: any, i: number) {
    if (column.score == null) {
      this.gradeService.decrementScore(column.id).subscribe(e => {
        this.assignData(e);
      })
    } else if (column.score == 1) {
      this.gradeService.neutralScore(column.id).subscribe(e => {
        this.assignData(e);
      })
    } else {
      return
    }
    this.cdr.detectChanges();

  }


  clear(playId: number) {
    this.gradeService.clearPlay(playId).subscribe(e => {
      this.assignData(e)
    })
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

  private assignData(response) {
    this.listOfColumns = response.overall_position_trait.map(f => f.position_trait.trait)
    console.log(response)
    this.totalValue = response.overall_grade
    response.overall_position_trait.forEach(f => {
      this.columnValue[f.position_trait.trait.id] = f.percentage_score
    })
    this.grading = response.grade
    this.today = Date.now();
    this.cdr.detectChanges();
  }
}

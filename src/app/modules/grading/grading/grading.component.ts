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
import {LoadingService} from "../../../shared/services/loading.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, NzButtonModule, NzToolTipModule, NzModalModule, ReactiveFormsModule],
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
  today: number = Date.now();
  isVisible = false;
  isOkLoading = false;
  gradeSummary: string
  summary = new FormControl('')
  private selectedPosition: Position;
  private selectedProspect: Prospect;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute, private gradeService: GradingService, public loadingService: LoadingService) {

  }

  ngOnInit(): void {
    this.selectedPosition = this.gradeService.selectedPosition
    this.selectedProspect = this.gradeService.selectedProspect
    if (!this.selectedProspect || !this.selectedPosition) {
      setTimeout(t => {
        this.router.navigate(['app/grade'])
      }, 1000)
    } else {
      this.position = this.selectedPosition.position_name;
      this.prospect = this.selectedProspect;
      this.gradeService.getPlays(this.selectedPosition.id, this.selectedProspect.id).subscribe(response => {
        console.log(response)
        this.assignData(response)
      }, err => {
        this.addRow()
      })

    }
    this.gradeService.getGradeSummary(this.selectedPosition.id, this.selectedProspect.id).subscribe(summary => {
      this.gradeSummary = summary.summary
      this.summary.setValue(summary.summary)
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
    this.gradeService.editGradeSummary(this.selectedPosition.id, this.selectedProspect.id, this.summary.value).subscribe(response => {
      this.gradeSummary = response.summary
    })
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.router.navigate(['app/grade'])
    }, 2000);

  }


  handleCancel(): void {
    this.isVisible = false;
  }

  private assignData(response) {
    this.listOfColumns = response.overall_position_trait.map(f => f.position_trait.trait)
    this.totalValue = response.overall_grade
    response.overall_position_trait.forEach(f => {
      this.columnValue[f.position_trait.trait.id] = f.percentage_score
    })
    this.grading = response.grade
    this.today = Date.now();
    this.cdr.detectChanges();
  }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectListComponent, ProspectWithScore} from "../trajectory-report/prospect-list/prospect-list.component";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AcademyUsername, Position, Prospect, Result} from "../../../shared/interfaces/report";
import {ReportService} from "../../../shared/services/report.service";
import {AuthenticationService} from "../../../shared/services/authentication.service";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NgChartsModule} from "ng2-charts";
import {NzSelectModule} from "ng-zorro-antd/select";
import {main_url} from "../../../../environments/environment";

@Component({
  selector: 'app-academy-trajectory-report',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzGridModule, NgChartsModule, NzSelectModule, ReactiveFormsModule, ProspectListComponent],
  templateUrl: './academy-trajectory-report.component.html',
  styleUrls: ['./academy-trajectory-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyTrajectoryReportComponent implements OnInit {
  prospectList: ProspectWithScore[] = [];
  selectedProspects: { id: number, position: number, evaluator: string }[] = [];
  classification: string[] = [];
  positions: Position[] = [];
  prospects: Prospect[] = [];
  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';
  selectedEvaluators: FormControl = new FormControl<number[]>([]);
  selectedPositions: FormControl = new FormControl<number[]>([]);
  selected_Prospects: FormControl = new FormControl<number[]>([]);
  selectedClassifications: FormControl = new FormControl<string[]>([]);
  evaluators: AcademyUsername[] = [];
  private mainData: Result[] = [];
  currentData: Result[] = []
  activeFilter = {
    selectedPositions: [],
    selectedClassifications: [],
    selected_Prospects: [],
  };
  ids: string = ''
  public isMouseOnCanvas: boolean = false;
  private reportData: { x: number; y: number }[] = [];

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    const user = this.authService.currentUser$.value
    this.reportService.getAcademyUsernames().subscribe(usernames => {
      this.evaluators = usernames
    })

    this.setData(user.id)
    this.selectedEvaluators.setValue([user.id])


    this.selectedEvaluators.valueChanges.subscribe((evaluators) => {
      evaluators = evaluators.filter(e => e !== 'all')
      if (evaluators.length > 0) {
        this.setData(evaluators)
        this.resetFilters()
      } else {
        this.mainData = [];
        this.prospects = [];
        this.positions = [];
        this.classification = [];
        this.selectedPositions.disable();
        this.selected_Prospects.disable();
        this.selectedClassifications.disable();
        this.assignDataToPlot([])
        this.reset()
        this.cdr.detectChanges();
      }
    });
    this.selected_Prospects.valueChanges.subscribe((ids) => {
      this.activeFilter.selected_Prospects = ids || [];
      this.applyFilters();
    });
    this.selectedPositions.valueChanges.subscribe((ids) => {
      this.activeFilter.selectedPositions = ids || [];
      this.applyFilters();
    });
    this.selectedClassifications.valueChanges.subscribe((years) => {
      this.activeFilter.selectedClassifications = years || [];
      this.applyFilters();
    });
  }

  filterPosition(ids: number[], data: Result[]): Result[] {
    if (ids.length < 1) {
      return data;
    }
    this.cdr.detectChanges();
    return data.filter((item) => {
      return ids.includes(item.position.id);
    });
  }

  filterProspectSelect(ids: number[], data: Result[]): Result[] {
    if (ids.length < 1) {
      return data;
    }
    this.cdr.detectChanges();
    return data.filter((item) => {
      return ids.includes(item.prospect.id);
    });
  }

  filterClassification(year: string[], data: Result[]): Result[] {
    if (year.length < 1) {
      return data;
    }
    this.cdr.detectChanges();
    return data.filter((item) => {
      return year.includes(item.prospect.classification);
    });
  }

  applyFilters() {
    let data = this.mainData;
    for (const activeFilterKey in this.activeFilter) {
      if (activeFilterKey === 'selectedClassifications') {
        data = this.filterClassification(
          this.activeFilter.selectedClassifications,
          data
        );
      }
      if (activeFilterKey === 'selectedPositions') {
        data = this.filterPosition(this.activeFilter.selectedPositions, data);
      }
      if (activeFilterKey === 'selected_Prospects') {
        data = this.filterProspectSelect(this.activeFilter.selected_Prospects, data);
      }
    }
    this.assignDataToPlot(data);
  }

  setData(id: number) {
    this.reportService.getAcademyTrajectoryReportData(id).subscribe((e) => {
      this.mainData = e;
      this.classification = e.map((x) => x.prospect.classification);
      this.positions = e.map((x) => x.position);
      this.prospects = e.map((x) => x.prospect);
      const classArr = [...new Set(this.classification)];
      const idArr = [...new Set(this.positions.map((e) => e.id))];
      const prosArr = [...new Set(this.prospects.map((e) => e.id))];
      this.classification = classArr.sort((a, b) => a.localeCompare(b));
      this.positions = idArr.map((id) => {
        return this.positions.find((pos) => pos.id === id);
      });
      this.prospects = prosArr.map((id) => {
        return this.prospects.find((pos) => pos.id === id);
      }).sort((a, b) => a.first_name.localeCompare(b.first_name));
      this.setProspects(e)
      this.assignDataToPlot(e);
      this.cdr.detectChanges();
    });
    this.selectedPositions.enable();
    this.selected_Prospects.enable();
    this.selectedClassifications.enable();
  }

  assignDataToPlot(report: Result[]) {
    this.reportData = report.map((player) => {
      return {x: player.score, y: player.iga_score ? player.iga_score : 0};
    });
    this.setProspects(report);
    this.currentData = report;
    this.scatterChartLabels = report.map(
      (e) =>
        `Eval: ${e.user_full_name}` +
        '\n' +
        e.prospect.first_name +
        ' ' +
        e.prospect.last_name +
        '\n' +
        e.prospect.school +
        '\n' +
        e.prospect.classification +
        ' ' +
        e.position.position_name +
        '\n' +
        e.prospect.state
    );
    this.RenderScatterChart(this.reportData, this.scatterChartLabels);
    this.cdr.detectChanges();
  }

  setProspects(data) {
    this.prospectList = data
      .map((x) => {
        return {
          ...x.prospect,
          score: x.score,
          iga_score: x.iga_score,
          position: x.position,
          evaluator: x.user_full_name
        };
      })
      .sort((a, b) => {
        if (a.score < b.score) {
          return a.score;
        }
        if (b.score < a.score) {
          return b.score;
        }
        return 0;
      });
    this.ids = data.map(e => e.id).join(',')

    this.prospectList.sort((a, b) => a.first_name.localeCompare(b.first_name) || (b.score - a.score))

  }

  filterProspect(prospect: ProspectWithScore) {
    const isExist = this.selectedProspects.find((selectedProspect) => {
      return selectedProspect.id === prospect.id && selectedProspect.position === prospect.position.id && selectedProspect.evaluator === prospect.evaluator;
    });
    if (isExist) {
      this.selectedProspects = this.selectedProspects.filter(
        (item) => item.id != prospect.id && item.position != prospect.position.id && item.evaluator != prospect.evaluator
      );
    } else {
      this.selectedProspects.push({id: prospect.id, position: prospect.position.id, evaluator: prospect.evaluator});
    }
    let data = [];
    this.selectedProspects.forEach((prospect) => {
      data.push(
        ...this.mainData.filter((item) => item.prospect.id === prospect.id && item.position.id === prospect.position && item.user_full_name === prospect.evaluator)
      );
    });
    this.assignDataToPlot(data.length < 1 ? this.mainData : data);
  }

  reset() {
    this.selectedProspects = [];
    this.assignDataToPlot(this.mainData);
  }

  resetFilters() {
    this.selectedClassifications.reset();
    this.selectedPositions.reset();
    this.selected_Prospects.reset();
    this.reset()
  }

  selectAllOptions(selectedValue: string[]): void {
    if (selectedValue.includes('all')) {
      this.selectedEvaluators.setValue(this.evaluators.map(evaluator => evaluator.id));
    }
  }

  exportToPdf() {
    window.open(`${main_url}trajectory_report/export_to_pdf/${this.ids}/`, '_self')
  }

  // events
  public chartClicked(event): void {
    console.log(event);
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event: ChartEvent;
    active: {}[];
  }): void {
  }


  mouseOnCanvas() {
    this.isMouseOnCanvas = true;
  }

  mouseOffCanvas() {
    this.isMouseOnCanvas = false;
  }


  private RenderScatterChart(
    reportData: { x: number; y: number }[],
    labelsData: string[]
  ) {
    // @ts-ignore
    const quadrants = (this.scatterChartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'center',
          max: 101,
          min: -1,
          grid: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          position: 'center',
          max: 101,
          min: -1,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    });
    this.scatterChartData = {
      labels: labelsData,
      datasets: [
        {
          data: reportData,
          pointRadius: 5,
          borderColor: 'black',
        },
      ],
    };
  }
}

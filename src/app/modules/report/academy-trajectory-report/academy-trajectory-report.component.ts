import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectListComponent, ProspectWithScore} from "../trajectory-report/prospect-list/prospect-list.component";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AcademyUsername, Result} from "../../../shared/interfaces/report";
import {ReportService} from "../../../shared/services/report.service";
import {AuthenticationService} from "../../../shared/services/authentication.service";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NgChartsModule} from "ng2-charts";
import {NzSelectModule} from "ng-zorro-antd/select";

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
  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';
  selectedEvaluators: FormControl = new FormControl<number[]>([]);
  evaluators: AcademyUsername[] = [];
  private mainData: Result[] = [];
  currentData: Result[] = []
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

    this.reportService.getAcademyTrajectoryReportData(user.id).subscribe((e) => {
      this.selectedEvaluators.setValue([user.id])
      this.setProspects(e)
      this.assignDataToPlot(e);
      this.cdr.detectChanges();
    });

    this.selectedEvaluators.valueChanges.subscribe((prospects) => {
      if (prospects.length > 0) {
        this.reportService.getAcademyTrajectoryReportData(prospects).subscribe((e) => {
          this.setProspects(e)
          this.mainData = e;
          this.assignDataToPlot(e);
          this.reset()
          this.cdr.detectChanges();
        });
      } else {
        this.mainData = [];
        this.assignDataToPlot([])
        this.reset()
        this.cdr.detectChanges();
      }
    });
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

    this.prospectList.sort((a, b) => a.first_name.localeCompare(b.first_name))
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

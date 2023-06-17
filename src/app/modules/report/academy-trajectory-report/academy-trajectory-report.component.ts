import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProspectWithScore} from "../trajectory-report/prospect-list/prospect-list.component";
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
  imports: [CommonModule, NzButtonModule, NzGridModule, NgChartsModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './academy-trajectory-report.component.html',
  styleUrls: ['./academy-trajectory-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyTrajectoryReportComponent implements OnInit {
  prospectList: ProspectWithScore[] = [];
  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';


  selectedProspects: FormControl = new FormControl<number[]>([]);
  prospects: AcademyUsername[] = [];
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
      this.prospects = usernames
    })

    this.reportService.getAcademyTrajectoryReportData(user.id).subscribe((e) => {
      this.selectedProspects.setValue([user.id])
      this.assignDataToPlot(e);
      this.cdr.detectChanges();
    });

    this.selectedProspects.valueChanges.subscribe((prospects) => {
      if (prospects.length > 0) {
        this.reportService.getAcademyTrajectoryReportData(prospects).subscribe((e) => {
          this.assignDataToPlot(e);
          this.cdr.detectChanges();
        });
      } else {
        this.assignDataToPlot([])
        this.cdr.detectChanges();
      }
    });
  }


  assignDataToPlot(report: Result[]) {
    this.reportData = report.map((player) => {
      return {x: player.score, y: player.iga_score ? player.iga_score : 0};
    });
    this.currentData = report;
    this.scatterChartLabels = report.map(
      (e) =>
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
          backgroundColor: (ctx) => {
            return '#28579d';
          },
        },
      ],
    };
  }
}

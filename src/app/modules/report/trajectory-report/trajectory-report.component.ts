import {ChangeDetectorRef, Component,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgChartsModule} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import {ReportService} from "../../../shared/services/report.service";
import {NzGridModule} from "ng-zorro-antd/grid";
import {
  StatesSelectSearchComponent
} from "../../../shared/components/states-select-search/states-select-search.component";
import {
  PositionMultiSelectComponent
} from "../../../shared/components/position-multi-select/position-multi-select.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {
  ClassificationSelectComponent
} from "../../../shared/components/classification-select/classification-select.component";
import {StaffSelectComponent} from "../../../shared/components/staff-select/staff-select.component";
import {Prospect} from "../../../shared/interfaces/report";
import {ProspectListComponent} from "./prospect-list/prospect-list.component";


@Component({
  selector: 'app-trajectory-report',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NzGridModule, StatesSelectSearchComponent, PositionMultiSelectComponent, NzSelectModule, FormsModule, ClassificationSelectComponent, StaffSelectComponent, ProspectListComponent],
  templateUrl: './trajectory-report.component.html',
  styleUrls: ['./trajectory-report.component.scss'],
})
export class TrajectoryReportComponent {
  prospectList: Prospect[];
  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';

  scoreProspect: number[];
  private reportData: { x: number; y: number }[] = [];

  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(e => {
      this.reportData = e.map(player => {
        return {x: player.score, y: player.iga_score ? player.iga_score : 0}
      })
      this.scoreProspect = e.map(player => {
        return player.score
      })
      console.log(this.scoreProspect)
      this.scatterChartLabels = e.map(e => e.prospect.first_name + ' ' + e.prospect.last_name)
      this.prospectList = e.map(prospect => prospect.prospect)
      this.RenderScatterChart(this.reportData, this.scatterChartLabels);
    })
    this.cdr.detectChanges()
  }

  // events
  public chartClicked(event): void {
    console.log(event);
  }

  public chartHovered({event, active}: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  private RenderScatterChart(reportData: { x: number; y: number }[], labelsData: string[]) {
    this.scatterChartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'center',
          max: 100,
          min: 0,
          grid: {
            display: false
          },
        },
        y: {
          type: 'linear',
          position: 'center',
          max: 100,
          min: 0,
          grid: {
            display: false
          }
        },

      },
      plugins: {
        legend: {
          display: false,
        }

      }
    };
    this.scatterChartData = {
      labels: labelsData,
      datasets: [
        {
          data: reportData,
          pointRadius: 5,
          backgroundColor: (ctx) => {
            return '#28579d'
          }
        },
      ]
    };
  }
}

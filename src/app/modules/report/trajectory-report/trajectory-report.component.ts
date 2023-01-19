import {Component,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgChartsModule} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import {ReportService} from "../../../shared/services/report.service";


@Component({
  selector: 'app-trajectory-report',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './trajectory-report.component.html',
  styleUrls: ['./trajectory-report.component.scss'],
})
export class TrajectoryReportComponent {


  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';


  private reportData: { x: number; y: number }[] = [];

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(e => {
      this.reportData = e.map(player => {
        return {x: player.score, y: player.iga_score ? player.iga_score : 0}
      })
      this.scatterChartLabels = e.map(e => e.prospect.first_name + ' ' + e.prospect.last_name)
      this.RenderScatterChart(this.reportData, this.scatterChartLabels);
    })
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
          pointRadius: 10,
        },
      ]
    };
  }
}

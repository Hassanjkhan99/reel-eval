import {Component, OnInit, ViewChild,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReportService} from '../../../shared/services/report.service';
import {Position, Prospect} from "../../../shared/interfaces/bar-report";

@Component({
  selector: 'app-prospect-report',
  standalone: true,
  imports: [CommonModule, NzGridModule, NgChartsModule, NzInputModule],
  templateUrl: './prospect-report.component.html',
  styleUrls: ['./prospect-report.component.scss'],
})
export class ProspectReportComponent implements OnInit {
  prospect: Prospect = null;
  position: Position = null;
  overallGrade: number = 0
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        grid: {
          display: false,

        },
        display: false
      },
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = null

  constructBarGraph(labels: string[], data: number[]) {
    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgb(113,192,248)',
        },
      ],
    };
  }

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.reportService.getBarReportData(1, 76).subscribe((barData) => {
      this.prospect = barData.prospect;
      this.position = barData.position;
      this.overallGrade = barData.grade.overall_grade
      console.log(barData.grade.overall_position_trait)
      const labels = barData.grade.overall_position_trait.map(trait => {
        return trait.position_trait.trait.trait
      })
      const data = barData.grade.overall_position_trait.map(trait => {
        return trait.percentage_score
      })
      console.log({labels, data})
      this.constructBarGraph(labels, data)

    });
  }

  // events
  public chartClicked({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }
}

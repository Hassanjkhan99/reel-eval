import {Component, OnInit, ViewChild,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReportService} from '../../../shared/services/report.service';

@Component({
  selector: 'app-prospect-report',
  standalone: true,
  imports: [CommonModule, NzGridModule, NgChartsModule, NzInputModule],
  templateUrl: './prospect-report.component.html',
  styleUrls: ['./prospect-report.component.scss'],
})
export class ProspectReportComponent implements OnInit {
  prospect: string = '';
  position: string = '';
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 50,
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
  public barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 90],
        label: 'Series A',
        backgroundColor: 'rgb(113,192,248)',
      },
    ],
  };

  constructor(private reportService: ReportService) {
  }

  ngOnInit(): void {
    this.reportService.getBarReportData(1, 76).subscribe((barData) => {
      console.log(barData);
      this.prospect = barData.prospect.first_name + ' ' + barData.prospect.last_name;
      this.position = barData.position

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

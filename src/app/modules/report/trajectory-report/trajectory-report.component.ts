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
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ClassificationSelectComponent
} from "../../../shared/components/classification-select/classification-select.component";
import {StaffSelectComponent} from "../../../shared/components/staff-select/staff-select.component";
import {Position, Prospect, Result} from "../../../shared/interfaces/report";
import {ProspectListComponent} from "./prospect-list/prospect-list.component";


@Component({
  selector: 'app-trajectory-report',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NzGridModule, StatesSelectSearchComponent, PositionMultiSelectComponent, NzSelectModule, FormsModule, ClassificationSelectComponent, StaffSelectComponent, ProspectListComponent, ReactiveFormsModule],
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

  selectedPositions: FormControl = new FormControl<number[]>([])

  scoreProspect: number[];
  private reportData: { x: number; y: number }[] = [];
  positions: Position[] = []
  private mainData: Result[] = []


  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(e => {
      this.mainData = e
      this.positions = e.map(e => e.position);

      const idArr = [...new Set(this.positions.map(e => e.id))]

      this.positions = idArr.map(id => {
        return this.positions.find(pos => pos.id === id)
      })


      this.cdr.detectChanges()
      this.assignDataToPlot(e)
    })
    this.selectedPositions.valueChanges.subscribe(ids => {
      this.filterPosition(ids)
    })
  }

  assignDataToPlot(report: Result[]) {
    this.reportData = report.map(player => {
      return {x: player.score, y: player.iga_score ? player.iga_score : 0}
    })
    this.scoreProspect = report.map(player => {
      return player.score
    })
    this.scatterChartLabels = report.map(e => e.prospect.first_name + ' ' + e.prospect.last_name)
    this.prospectList = report.map(prospect => prospect.prospect)
    this.RenderScatterChart(this.reportData, this.scatterChartLabels);
    this.cdr.detectChanges()
  }

  filterPosition(ids: number[]) {
    if (ids.length < 1) {
      this.assignDataToPlot(this.mainData)
      return
    }
    const data = this.mainData.filter(item => {
      return ids.includes(item.position.id)
    })
    this.assignDataToPlot(data)
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

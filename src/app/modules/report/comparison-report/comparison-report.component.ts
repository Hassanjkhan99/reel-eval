import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Position, PositionProspect, Prospect,} from '../../../shared/interfaces/bar-report';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {ReportService} from '../../../shared/services/report.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzSelectModule} from 'ng-zorro-antd/select';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CardComponent} from '../../../shared/components/card/card.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';

@UntilDestroy()
@Component({
  selector: 'app-comparison-report',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NgChartsModule,
    NzSelectModule,
    ReactiveFormsModule,
    CardComponent,
    NzInputModule,
    PositionsSelectComponent,
  ],
  templateUrl: './comparison-report.component.html',
  styleUrls: ['./comparison-report.component.scss'],
})
export class ComparisonReportComponent implements OnInit {
  prospect: Prospect = null;
  position: Position = null;
  prospects: Prospect[] = [];
  summary: string[] = [];
  selectedProspect = new FormControl(null);
  selectedPosition = new FormControl(null);
  overallGrade: number = null;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        grid: {
          display: false,
        },
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
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = null;
  public prospectWithPosition: { [id: number]: Position[] };
  public barChartPlugins = [DataLabelsPlugin];

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {
  }

  constructBarGraph(labels: string[], dataSets: number[][]) {
    const dataArr = dataSets.map((data) => {
      return {
        data,
        barThickness: 50,
      };
    });
    this.barChartData = {
      labels,
      datasets: dataArr,
    };
  }

  ngOnInit(): void {
    this.reportService
      .getPositionProspects()
      .pipe(untilDestroyed(this))
      .subscribe((positionProspects) => {
        this.prospectWithPosition = {};
        this.prospects.forEach((prospect) => {
          this.prospectWithPosition[prospect.id] = positionProspects
            .filter((e) => e.prospect.id === prospect.id)
            .map((e) => e.position);
        });
      });

    this.selectedProspect.valueChanges.subscribe((idArr: number[]) => {
      this.barChartData = null;
      idArr.forEach((id) => {
        this.getData(this.selectedPosition.value, id);
      });
    });
    this.selectedPosition.valueChanges.subscribe((id) => {
      this.barChartData = null;
      this.reportService.getPositionProspects(id).subscribe((prospects) => {
        this.getProspects(prospects);
      });
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
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
  }

  getData(posId: number, prosId: number) {
    this.reportService.getBarReportData(posId, prosId).subscribe((barData) => {
      this.prospect = barData.prospect;
      this.position = barData.position;
      this.overallGrade = barData.grade.overall_grade;
      const labels = barData.grade.overall_position_trait.map((trait) => {
        return trait.position_trait.trait.trait;
      });
      const data = barData.grade.overall_position_trait.map((trait) => {
        return trait.percentage_score;
      });
    });
    this.reportService.getSummaryBarReport(posId, prosId).subscribe((sum) => {
      this.cdr.detectChanges();
    });
  }

  getProspects(positionProspects: PositionProspect[]) {
    let prospects: Prospect[] = [];
    prospects = positionProspects.map((prospect) => {
      return prospect.prospect;
    });
    const idArr = [...new Set(prospects.map((e) => e.id))];
    this.prospects = [];
    idArr.forEach((id) => {
      this.prospects.push(prospects.find((pros) => pros.id === id));
    });
  }

  getSummary() {

  }
}

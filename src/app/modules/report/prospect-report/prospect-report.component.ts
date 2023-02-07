import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReportService} from '../../../shared/services/report.service';
import {Position, Prospect} from '../../../shared/interfaces/bar-report';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CardComponent} from "../../../shared/components/card/card.component";
import {NzButtonModule} from "ng-zorro-antd/button";


@UntilDestroy()
@Component({
  selector: 'app-prospect-report',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NgChartsModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    CardComponent,
    NzButtonModule,
  ],
  templateUrl: './prospect-report.component.html',
  styleUrls: ['./prospect-report.component.scss'],
})
export class ProspectReportComponent implements OnInit {
  prospect: Prospect = null;
  position: Position = null;
  prospects: Prospect[] = [];
  summary: string = ''
  selectedProspect = new FormControl(null);
  selectedPosition = new FormControl(null);
  overallGrade: number = null;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: true,
    layout: {
      padding: {
        top: 30,
        bottom: 5
      }
    },
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
      tooltip: {
        enabled: false
      },

    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = null;
  public prospectWithPosition: { [id: number]: Position[] };
  public barChartPlugins = [
    DataLabelsPlugin
  ];


  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) {
  }

  constructBarGraph(labels: string[], data: number[]) {
    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgba(51,111,204,0.79)',
          barThickness: 50,
        }

      ],
    };
  }

  ngOnInit(): void {
    this.reportService
      .getPositionProspects()
      .pipe(untilDestroyed(this))
      .subscribe((positionProspects) => {
        let prospects: Prospect[] = [];
        prospects = positionProspects.map((prospect) => {
          return prospect.prospect;
        });
        const idArr = [...new Set(prospects.map((e) => e.id))];
        this.prospects = [];
        idArr.forEach((id) => {
          this.prospects.push(prospects.find((pros) => pros.id === id));
        });

        this.prospectWithPosition = {};
        this.prospects.forEach((prospect) => {
          this.prospectWithPosition[prospect.id] = positionProspects
            .filter((e) => e.prospect.id === prospect.id)
            .map((e) => e.position);
        });
      });

    this.selectedProspect.valueChanges.subscribe((id) => {
      this.barChartData = null;
      this.prospect = null;
      this.position = null;
      this.overallGrade = null;
      this.selectedPosition.reset(null, {emitEvent: false});
      if (this.prospectWithPosition[id].length < 2) {
        this.selectedPosition.setValue(this.prospectWithPosition[id][0].id);
        this.getData(this.selectedPosition.value, this.selectedProspect.value);
      }
    });
    this.selectedPosition.valueChanges.subscribe((id) => {
      this.barChartData = null;
      if (
        this.selectedProspect.value &&
        this.selectedPosition.value &&
        this.prospectWithPosition[this.selectedProspect.value].length > 1
      ) {
        this.getData(this.selectedPosition.value, this.selectedProspect.value);
      }
    });
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
      this.constructBarGraph(labels, data);
    });
    this.reportService.getSummaryBarReport(posId, prosId).subscribe(sum => {
      this.summary = sum.summary
      this.cdr.detectChanges()
    })
  }
}

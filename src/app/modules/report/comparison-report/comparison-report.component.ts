import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Position, PositionProspect, Prospect,} from '../../../shared/interfaces/bar-report';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartDataset, ChartType} from 'chart.js';
import {ReportService} from '../../../shared/services/report.service';
import {UntilDestroy} from '@ngneat/until-destroy';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzSelectModule} from 'ng-zorro-antd/select';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CardComponent} from '../../../shared/components/card/card.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import {PositionsSelectComponent} from '../../../shared/components/positions-select/positions-select.component';
import {SummaryPipe} from "./summary.pipe";
import {NzButtonModule} from "ng-zorro-antd/button";

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
    SummaryPipe,
    NzButtonModule,
  ],
  templateUrl: './comparison-report.component.html',
  styleUrls: ['./comparison-report.component.scss'],
})
export class ComparisonReportComponent implements OnInit {
  prospects: Prospect[] = [];
  selectedProspects = new FormControl(null);
  selectedPosition = new FormControl(null);
  overallGrade: { id: number, grade: number, name: string }[] = [];
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: true,
    layout: {
      padding: {
        top: 30,
        bottom: 7,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 25,
          font: {
            weight: 'bold',
            size: 13,
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 13,
          weight: 'bold',
        },
      },
      tooltip: {
        enabled: false
      }

    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = null;
  public prospectWithPosition: { [id: number]: Position[] };
  public barChartPlugins = [DataLabelsPlugin];


  public barChartColors: { backgroundColor: string }[] = [
    {backgroundColor: 'rgba(248,6,6,0.61)'},
    {backgroundColor: 'rgba(0, 135, 245, 0.77)'},
    {backgroundColor: 'rgba(131,208,5,0.66)'},
    {backgroundColor: 'rgba(255, 165, 0, 0.71)'},
  ]

  public barChartColorsClasses: string[] = [
    'red',
    'blue',
    'green',
    'orange',
  ]


  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {
  }


  ngOnInit(): void {
    this.selectedPosition.valueChanges.subscribe((position: Position) => {
      this.barChartData = null;
      this.selectedProspects.reset(null, {emitEvent: false});
      this.prospects = []
      this.reportService.getPositionProspects(position.id).subscribe((prospects) => {
        this.getProspects(prospects);
      });
    });

    this.selectedProspects.valueChanges.subscribe(async (prospectArr: Prospect[]) => {
      this.barChartData = null;
      const barData: { labels: string [], data: number[], overallGrade: number, prospectId: number }[] = []
      for (const prospect of prospectArr) {
        barData.push(await this.getData(this.selectedPosition.value.id, prospect.id))
      }
      this.overallGrade = barData.map(e => {
        const prospect: Prospect = this.selectedProspects.value.find(prospect => e.prospectId === prospect.id)
        return {
          id: e.prospectId,
          name: prospect.first_name + ' ' + prospect.last_name,
          grade: e.overallGrade
        }
      });

      const dataSets: ChartDataset<'bar'>[] = barData.map((e, i) => {
        const prospect: Prospect = this.selectedProspects.value.find(prospect => prospect.id === e.prospectId)
        return {
          data: e.data,
          label: prospect.first_name + ' ' + prospect.last_name,
          backgroundColor: this.barChartColors[i].backgroundColor,
        }
      })
      this.constructBarGraph(barData[0].labels, dataSets)
    });
  }

  async getData(posId: number, prosId: number,): Promise<{ data: number[]; overallGrade: number; labels: string[], prospectId: number }> {
    const barData = await this.reportService.getBarReportData(posId, prosId).toPromise()

    const labels = barData.grade.overall_position_trait.map((trait) => {
      return trait.position_trait.trait.trait;
    });
    const data = barData.grade.overall_position_trait.map((trait) => {
      return trait.percentage_score;
    });
    return {labels, data, overallGrade: barData.grade.overall_grade, prospectId: prosId}
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
    this.prospects.sort((a, b) => a.first_name.localeCompare(b.first_name))
    this.cdr.detectChanges()
  }

  constructBarGraph(labels: string[], datasets: ChartDataset<'bar'>[]) {
    this.barChartData = {
      labels,
      datasets,
    };
    this.cdr.detectChanges()
  }

  printDiv(): void {

    document.getElementsByTagName("body").item(0).setAttribute('class', 'test')
    window.print()
  }
}

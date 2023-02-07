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
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = null;
  public prospectWithPosition: { [id: number]: Position[] };
  public barChartPlugins = [DataLabelsPlugin];
  public barChartColors: { backgroundColor: string }[] = [
    {backgroundColor: 'red'},
    {backgroundColor: 'green'},
    {backgroundColor: 'blue'},
    {backgroundColor: 'yellow'},
    {backgroundColor: 'orange'},
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
          barThickness: 50,
          label: prospect.first_name + ' ' + prospect.last_name,
          backgroundColor: this.barChartColors[i].backgroundColor
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
    this.cdr.detectChanges()
  }

  constructBarGraph(labels: string[], datasets: ChartDataset<'bar'>[]) {

    console.log(this.selectedProspects.value)
    this.barChartData = {
      labels,
      datasets,
    };
    this.cdr.detectChanges()
  }
}

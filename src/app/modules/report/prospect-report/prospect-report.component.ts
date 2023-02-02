import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReportService} from '../../../shared/services/report.service';
import {Position, Prospect} from '../../../shared/interfaces/bar-report';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

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
  ],
  templateUrl: './prospect-report.component.html',
  styleUrls: ['./prospect-report.component.scss'],
})
export class ProspectReportComponent implements OnInit {
  prospect: Prospect = null;
  position: Position = null;
  positions: Position[] = [];
  prospects: Prospect[] = [];
  selectedProspect = new FormControl(null);
  selectedPosition = new FormControl(null);
  prospectSelected: number = null
  positionSelected: number = null
  overallGrade: number = null;
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
  public barChartData: ChartData<'bar'> = null;
  private prospectWithPosition: { [id: number]: Position[] };

  constructor(private reportService: ReportService) {
  }

  constructBarGraph(labels: string[], data: number[]) {
    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgb(113,192,248)',
          barThickness: 50,
        },
      ],
    };
  }

  ngOnInit(): void {
    this.reportService
      .getPositionProspects()
      .pipe(untilDestroyed(this))
      .subscribe((positionProspects) => {
        let prospects: Prospect[] = [];
        let positions: Position[] = [];
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
        console.log(this.prospectWithPosition)
      });

    this.selectedProspect.valueChanges.subscribe(id => {
      this.barChartData = null
      this.prospect = null;
      this.position = null;
      this.overallGrade = null
      this.prospectSelected = id
      this.positions = []
      this.prospectWithPosition[id].forEach(pos => {
        this.positions.push(pos)
      })
      if (this.positions.length < 2) {
        this.positionSelected = this.positions[0].id
        this.getData(this.positionSelected, this.prospectSelected)
      }
      console.log(this.positions)
    })
    this.selectedPosition.valueChanges.subscribe(id => {
      this.barChartData = null
      this.positionSelected = id
      if (this.prospectSelected && this.positionSelected) {
        this.getData(this.positionSelected, this.prospectSelected)
      }
    })

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

  }
}

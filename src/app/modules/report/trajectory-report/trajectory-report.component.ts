import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from 'chart.js';
import {ReportService} from '../../../shared/services/report.service';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {
  StatesSelectSearchComponent
} from '../../../shared/components/states-select-search/states-select-search.component';
import {
  PositionMultiSelectComponent
} from '../../../shared/components/position-multi-select/position-multi-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StaffSelectComponent} from '../../../shared/components/staff-select/staff-select.component';
import {Position, Result} from '../../../shared/interfaces/report';
import {ProspectListComponent, ProspectWithScore,} from './prospect-list/prospect-list.component';
import {NzButtonModule} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-trajectory-report',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    NzGridModule,
    StatesSelectSearchComponent,
    PositionMultiSelectComponent,
    NzSelectModule,
    FormsModule,
    StaffSelectComponent,
    ProspectListComponent,
    ReactiveFormsModule,
    NzButtonModule,
  ],
  templateUrl: './trajectory-report.component.html',
  styleUrls: ['./trajectory-report.component.scss'],
})
export class TrajectoryReportComponent {
  prospectList: ProspectWithScore[] = [];
  // scatter
  public scatterChartOptions: ChartConfiguration['options'];
  public scatterChartLabels: string[] = [];
  public scatterChartData: ChartData<'scatter'>;
  public scatterChartType: ChartType = 'scatter';

  selectedPositions: FormControl = new FormControl<number[]>([]);
  selectedClassifications: FormControl = new FormControl<string[]>([]);
  selectedStates: FormControl = new FormControl<string[]>([]);
  selectedStaffs: FormControl = new FormControl<string[]>([]);
  scoreProspect: number[];
  selectedProspects: { id: number, position: number }[] = [];
  private reportData: { x: number; y: number }[] = [];
  positions: Position[] = [];
  classification: string[] = [];
  states: string[] = [];
  staffs: string[] = [];
  activeFilter = {
    selectedPositions: [],
    selectedClassifications: [],
    selectedStates: [],
    selectedStaffs: [],
  };
  private mainData: Result[] = [];
  currentData: Result[] = []
  public isMouseOnCanvas: boolean = false;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe((e) => {
      this.mainData = e;
      this.positions = e.map((x) => x.position);
      this.setProspects(e)

      this.classification = e.map((x) => x.prospect.classification);
      this.states = e.map((x) => x.prospect.state);
      this.staffs = e.map((x) => x.user_full_name);
      const classArr = [...new Set(this.classification)];
      const stateArr = [...new Set(this.states)];
      const idArr = [...new Set(this.positions.map((e) => e.id))];
      const staffArr = [...new Set(this.staffs)];
      this.classification = classArr;
      this.states = stateArr;
      this.staffs = staffArr;
      this.positions = idArr.map((id) => {
        return this.positions.find((pos) => pos.id === id);
      });

      this.cdr.detectChanges();
      this.assignDataToPlot(e);
    });
    this.selectedPositions.valueChanges.subscribe((ids) => {
      this.activeFilter.selectedPositions = ids || [];
      this.applyFilters();
    });
    this.selectedClassifications.valueChanges.subscribe((years) => {
      this.activeFilter.selectedClassifications = years || [];
      this.applyFilters();
    });
    this.selectedStates.valueChanges.subscribe((states) => {
      this.activeFilter.selectedStates = states || [];
      this.applyFilters();
    });
    this.selectedStaffs.valueChanges.subscribe((staffs) => {
      this.activeFilter.selectedStaffs = staffs || [];
      this.applyFilters();
    });
  }

  setProspects(data) {
    this.prospectList = data
      .map((x) => {
        return {...x.prospect, score: x.score, iga_score: x.iga_score, position: x.position};
      })
      .sort((a, b) => {
        if (a.score < b.score) {
          return a.score;
        }
        if (b.score < a.score) {
          return b.score;
        }
        return 0;
      });
    this.prospectList.sort((a, b) => a.first_name.localeCompare(b.first_name))
  }

  applyFilters() {
    let data = this.mainData;
    for (const activeFilterKey in this.activeFilter) {
      if (activeFilterKey === 'selectedStates') {
        data = this.filterState(this.activeFilter.selectedStates, data);
      }
      if (activeFilterKey === 'selectedStaffs') {
        data = this.filterStaff(this.activeFilter.selectedStaffs, data);
      }
      if (activeFilterKey === 'selectedClassifications') {
        data = this.filterClassification(
          this.activeFilter.selectedClassifications,
          data
        );
      }
      if (activeFilterKey === 'selectedPositions') {
        data = this.filterPosition(this.activeFilter.selectedPositions, data);
      }
    }
    this.assignDataToPlot(data);
  }

  resetFilters() {
    this.selectedStates.reset();
    this.selectedStaffs.reset();
    this.selectedClassifications.reset();
    this.selectedPositions.reset();
  }

  assignDataToPlot(report: Result[]) {
    this.reportData = report.map((player) => {
      return {x: player.score, y: player.iga_score ? player.iga_score : 0};
    });
    this.setProspects(report);
    this.currentData = report;
    this.scoreProspect = report.map((player) => {
      return player.score;
    });
    this.scatterChartLabels = report.map(
      (e) =>
        e.prospect.first_name +
        ' ' +
        e.prospect.last_name +
        '\n' +
        e.prospect.school +
        '\n' +
        e.prospect.classification +
        ' ' +
        e.position.position_name +
        '\n' +
        e.prospect.state
    );
    this.RenderScatterChart(this.reportData, this.scatterChartLabels);
    this.cdr.detectChanges();
  }

  filterPosition(ids: number[], data: Result[]): Result[] {
    if (ids.length < 1) {
      return data;
    }


    console.log(this.selectedProspects)

    return data.filter((item) => {
      return ids.includes(item.position.id);
    });
  }

  filterClassification(year: string[], data: Result[]): Result[] {
    if (year.length < 1) {
      return data;
    }

    this.cdr.detectChanges();


    return data.filter((item) => {
      return year.includes(item.prospect.classification);
    });
  }

  filterState(state: string[], data: Result[]): Result[] {
    if (state.length < 1) {
      return data;
    }

    return data.filter((item) => {
      return state.includes(item.prospect.state);
    });
  }

  filterStaff(staff: string[], data: Result[]): Result[] {
    if (staff.length < 1) {
      return data;
    }


    return data.filter((item) => {
      return staff.includes(item.user_full_name);
    });
  }

  filterProspect(prospect: ProspectWithScore) {
    const isExist = this.selectedProspects.find((selectedProspect) => {
      return selectedProspect.id === prospect.id && selectedProspect.position === prospect.position.id;
    });
    if (isExist) {
      this.selectedProspects = this.selectedProspects.filter(
        (item) => item.id != prospect.id && item.position != prospect.position.id
      );
    } else {
      this.selectedProspects.push({id: prospect.id, position: prospect.position.id});
    }
    let data = [];
    this.selectedProspects.forEach((prospect) => {
      data.push(
        ...this.mainData.filter((item) => item.prospect.id === prospect.id && item.position.id === prospect.position)
      );
    });
    this.assignDataToPlot(data.length < 1 ? this.mainData : data);
  }

  // events
  public chartClicked(event): void {
    console.log(event);
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event: ChartEvent;
    active: {}[];
  }): void {
  }

  reset() {
    this.selectedProspects = [];
    this.assignDataToPlot(this.mainData);
    this.applyFilters();
  }

  mouseOnCanvas() {
    this.isMouseOnCanvas = true;
  }

  mouseOffCanvas() {
    this.isMouseOnCanvas = false;
  }

  private RenderScatterChart(
    reportData: { x: number; y: number }[],
    labelsData: string[]
  ) {
    // @ts-ignore
    const quadrants = (this.scatterChartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'center',
          max: 101,
          min: -1,
          grid: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          position: 'center',
          max: 101,
          min: -1,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    });
    this.scatterChartData = {
      labels: labelsData,
      datasets: [
        {
          data: reportData,
          pointRadius: 5,
          backgroundColor: (ctx) => {
            return '#28579d';
          },
        },
      ],
    };
  }
}

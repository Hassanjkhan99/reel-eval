import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {ReportService} from "../../../shared/services/report.service";
import {Position, Result} from "../../../shared/interfaces/report";
import {NzGridModule} from "ng-zorro-antd/grid";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-quadrant-report',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzGridModule, NzSelectModule, ReactiveFormsModule, NzButtonModule],
  templateUrl: './quadrant-report.component.html',
  styleUrls: ['./quadrant-report.component.scss'],
})
export class QuadrantReportComponent implements OnInit {

  impactPlayerData: Result[] = []
  adequateStarterData: Result[] = []
  qualityStarterData: Result[] = []
  backupCalibarData: Result[] = []
  selectedPositions: FormControl = new FormControl<number[]>([]);
  selectedClassifications: FormControl = new FormControl<string[]>([]);
  selectedStates: FormControl = new FormControl<string[]>([]);
  selectedStaffs: FormControl = new FormControl<string[]>([]);
  scoreProspect: number[];
  selectedProspects: { id: number, position: number }[] = [];
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
  mainData: Result[] = [];


  constructor(private reportService: ReportService,) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(data => {
      this.mainData = data
      this.setTablesData(data
      )

      this.positions = data.map((x) => x.position);

      this.classification = data.map((x) => x.prospect.classification);
      this.states = data.map((x) => x.prospect.state);
      this.staffs = data.map((x) => x.user_full_name);
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
    })

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

  setTablesData(data: Result[]) {
    this.impactPlayerData = data.filter(quadrant => quadrant.quadrant === 'Impact Player')
    this.qualityStarterData = data.filter(quadrant => quadrant.quadrant === 'Quality Starter')
    this.adequateStarterData = data.filter(quadrant => quadrant.quadrant === 'Adequate Starter')
    this.backupCalibarData = data.filter(quadrant => quadrant.quadrant === 'Backup Caliber')
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
    this.setTablesData(data)
  }

  resetFilters() {
    this.selectedStates.reset();
    this.selectedStaffs.reset();
    this.selectedClassifications.reset();
    this.selectedPositions.reset();
  }

  filterPosition(ids: number[], data: Result[]): Result[] {
    if (ids.length < 1) {
      return data;
    }
    return data.filter((item) => {
      return ids.includes(item.position.id);
    });
  }

  filterClassification(year: string[], data: Result[]): Result[] {
    if (year.length < 1) {
      return data;
    }

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
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {ReportService} from "../../../shared/services/report.service";
import {Result} from "../../../shared/interfaces/report";

@Component({
  selector: 'app-quadrant-report',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './quadrant-report.component.html',
  styleUrls: ['./quadrant-report.component.scss'],
})
export class QuadrantReportComponent implements OnInit {

  impactPlayerData: Result[] = []
  adequateStarterData: Result[] = []
  qualityStarterData: Result[] = []
  backupCalibarData: Result[] = []


  constructor(private reportService: ReportService,) {
  }

  ngOnInit(): void {
    this.reportService.getReportData().subscribe(data => {
      this.impactPlayerData = data.filter(quadrant => quadrant.quadrant === 'Impact Player')
      this.qualityStarterData = data.filter(quadrant => quadrant.quadrant === 'Quality Starter')
      this.adequateStarterData = data.filter(quadrant => quadrant.quadrant === 'Adequate Starter')
      this.backupCalibarData = data.filter(quadrant => quadrant.quadrant === 'Backup Caliber')

    })
  }

}

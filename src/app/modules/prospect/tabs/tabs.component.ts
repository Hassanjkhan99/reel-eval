import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ProspectService} from "../../../shared/services/prospect.service";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {ViewProspectComponent} from "../view-prospect/view-prospect.component";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {NzSafeAny} from "ng-zorro-antd/core/types";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, NzTabsModule, ViewProspectComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  archivedList: Prospect[] = [];
  unArchivedList: Prospect[] = [];

  isLoadingArchivedList: boolean = false;
  isLoadingUnArchivedList: boolean = false;
  totalArchived = 0;
  totalUnArchived = 0;
  params: NzTableQueryParams;
  pageIndexArchived: number = 1;
  pageIndexUnArchived: number = 1;
  pageSizeArchived: number = 8;
  pageSizeUnArchived: number = 8;
  filterList: Array<{ text: string; value: NzSafeAny; byDefault?: boolean }> = [];
  unArchivedClassificationList: { name: string }[] = [];
  archivedClassificationList: { name: string }[] = [];
  stateList: { name: string }[] = [];
  schoolList: { name: string }[] = [];


  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.prospectSer.getPositions().subscribe(positions => {
      this.filterList = positions.map(e => {
        return {
          value: e.position_name, text: e.position_name
        }
      })
      this.cdr.detectChanges()
    })

    this.prospectSer.getSchools().subscribe(schools => {
      this.schoolList = schools.map(e => {
        return {
          name: e.school_name
        }
      })
      this.cdr.detectChanges()
    })
  }

  getProspect() {
    this.isLoadingUnArchivedList = true
    this.prospectSer.getProspects(this.pageIndexUnArchived, this.pageSizeUnArchived, null, null, null).subscribe(
      x => {
        this.isLoadingUnArchivedList = false
        this.unArchivedList = x.results
        this.unArchivedClassificationList = x.results.map(e => {
          return {name: e.classification}
        })
        console.log(this.unArchivedClassificationList)
        this.totalUnArchived = x.count
      }
    )
  }

  getArchivedProspect() {
    this.isLoadingArchivedList = true
    this.prospectSer.getArchivedProspects(this.pageIndexArchived, this.pageSizeArchived, null, null, null).subscribe(
      x => {
        this.archivedList = x.results
        this.isLoadingArchivedList = false;
        this.archivedClassificationList = x.results.map(e => {
          return {name: e.classification}
        })
        this.totalArchived = x.count;
      }
    )
  }


  onQueryParamsChange(params: { params: NzTableQueryParams; filterField?: string }) {
    const {pageSize, pageIndex, sort, filter} = params.params;
    this.params = params.params;

    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;

    this.prospectSer
      .getProspects(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        filter,
        params.filterField
      )
      .subscribe((e) => {
        this.unArchivedList = e.results;
        this.totalUnArchived = e.count;
        this.pageIndexUnArchived = pageIndex;
        this.unArchivedClassificationList = [...new Set(e.results.map(e => e.classification))].map(name => {
          return {name}
        })
        console.log(this.unArchivedClassificationList)
        this.cdr.detectChanges()
      });
  }

  onQueryParamsChangeArchive(params: { params: NzTableQueryParams; filterField?: string }) {
    const {pageSize, pageIndex, sort, filter} = params.params;
    this.params = params.params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.prospectSer
      .getArchivedProspects(
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        filter,
        params.filterField
      )
      .subscribe((e) => {
        this.archivedList = e.results;
        this.totalArchived = e.count;
        this.pageIndexArchived = pageIndex
        this.archivedClassificationList = [...new Set(e.results.map(e => e.classification))].map(name => {
          return {name}
        })
        console.log(this.unArchivedClassificationList)
        this.cdr.detectChanges()

      });

  }

}

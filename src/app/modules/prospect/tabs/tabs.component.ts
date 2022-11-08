import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ProspectService} from "../../../shared/services/prospect.service";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {ViewProspectComponent} from "../view-prospect/view-prospect.component";
import {NzTableQueryParams} from "ng-zorro-antd/table";

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
  total = 0;
  params: NzTableQueryParams;
  pageIndex: number = 0;
  pageSize: number = 10;


  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getProspect();
    this.getArchivedProspect()
  }

  getProspect() {
    this.isLoadingUnArchivedList = true
    this.prospectSer.getProspects(0, 10, null, null, null).subscribe(
      x => {
        this.isLoadingUnArchivedList = false
        this.unArchivedList = x.results
        this.total = x.count
      }
    )
  }

  getArchivedProspect() {
    this.isLoadingArchivedList = true
    this.prospectSer.getArchivedProspects(0, 10, null, null, null).subscribe(
      x => {
        this.archivedList = x.results
        this.isLoadingArchivedList = false
        this.total = x.count
      }
    )
  }


  onQueryParamsChange(params: { params: NzTableQueryParams; filterField?: string }) {
    const {pageSize, pageIndex, sort, filter} = params.params;
    this.params = params.params;
    console.log(sort)

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
        console.log({pageIndex, pageSize, sortField, sortOrder, filter});
        this.unArchivedList = e.results;
        this.total = e.count;
        this.cdr.detectChanges()
      });
  }

  onQueryParamsChangeArchieve(params: { params: NzTableQueryParams; filterField?: string }) {
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
        console.log({pageIndex, pageSize, sortField, sortOrder, filter});
        this.archivedList = e.results;
        this.total = e.count;
        this.cdr.detectChanges()

      });

  }

}

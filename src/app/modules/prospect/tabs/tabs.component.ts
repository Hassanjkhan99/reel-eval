import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ProspectService} from "../../../shared/services/prospect.service";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {ViewProspectComponent} from "../view-prospect/view-prospect.component";

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

  constructor(private prospectSer: ProspectService,) {
  }

  ngOnInit(): void {
    this.getProspect();
    this.getArchivedProspect()
  }

  getProspect() {
    this.isLoadingUnArchivedList = true
    this.prospectSer.getProspects().subscribe(
      x => {
        this.unArchivedList = x
        this.isLoadingUnArchivedList = false
      }
    )
  }

  getArchivedProspect() {
    this.isLoadingArchivedList = true
    this.prospectSer.getArchivedProspects().subscribe(
      x => {
        this.archivedList = x
        this.isLoadingArchivedList = false
      }
    )
  }

}

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ProspectService} from "../../../shared/services/prospect.service";
import {NzInputModule} from "ng-zorro-antd/input";
import {PositionsSelectComponent} from "../../../shared/components/positions-select/positions-select.component";
import {Positions} from "../../../shared/interfaces/positions.interface";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-view-prospect',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, ReactiveFormsModule, NzInputModule, PositionsSelectComponent, NzPopconfirmModule, NzButtonModule],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
})
export class ViewProspectComponent implements OnInit {
  prospectForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    position: new FormControl({
      id: 0,
      position_name: ''
    }),
    classification: new FormControl(''),
    state: new FormControl(''),
    school: new FormControl(''),
    video_link: new FormControl(''),
    archived: new FormControl(false),
  });

  dataSet: Prospect[] = [];


  currentEditIndex: number;
  currentPosition: number;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef, private notification: NzNotificationService,
              private nzMessageService: NzMessageService) {
  }

  ngOnInit(): void {
    this.getProspect();
  }

  isEdit(i: number) {
    if (this.currentEditIndex != i && this.currentEditIndex > -1) {
      this.notification.error("Can't edit another row while editing a row", 'You are currently editing a row , ' +
        'please discard or save the changes', {
        nzPlacement: 'bottomRight',
        nzAnimate: true,
        nzPauseOnHover: true,
        nzDuration: 3000
      })
      return
    }

    this.currentPosition = this.dataSet[i].position.id
    console.log(this.dataSet[i]);
    this.currentEditIndex = i;
    this.prospectForm.setValue({
      first_name: this.dataSet[i].first_name,
      last_name: this.dataSet[i].last_name,
      position: this.dataSet[i].position,
      classification: this.dataSet[i].classification,
      state: this.dataSet[i].state,
      school: this.dataSet[i].school,
      video_link: this.dataSet[i].video_link,
      archived: false
    })
  }

  isSave(i: number) {
    this.notification.success('Success', 'Your changes has been saved!', {
      nzPlacement: 'bottomRight',
      nzAnimate: true,
      nzPauseOnHover: true,
      nzDuration: 3000
    })
    this.prospectSer.editProspect(this.dataSet[i].id, {...this.dataSet[i], ...this.prospectForm.value}).subscribe(
      x => {
        this.dataSet = this.dataSet.map(item => {
          if (item.id === x.id) {
            return x
          } else {
            return item
          }
        })
        this.currentEditIndex = -1;
        this.cdr.detectChanges();
      }
    )
  }

  isDelete(i: number) {
    this.notification.success('Success', 'Selected Prospect has been deleted!', {
      nzPlacement: 'bottomRight',
      nzAnimate: true,
      nzPauseOnHover: true,
      nzDuration: 3000
    })
    this.prospectSer.deleteProspect(this.dataSet[i].id).subscribe(
      x => {
        // this.dataSet.splice(i,1)
        this.dataSet = this.dataSet.map((item) => {
          if (item.id == this.dataSet[i].id) {
            return
          }
          return item
        }).filter(e => e)
        console.log(this.dataSet)
        this.cdr.detectChanges();
      },
    )
  }

  getProspect() {
    this.prospectSer.getProspects().subscribe(
      x => {
        this.dataSet = x;
      }
    )
  }

  setPosition(position: Positions) {
    this.prospectForm.get('position').setValue(position)
    console.log(position.position_name)
  }


  cancel(): void {
    this.nzMessageService.info('clicked cancel');
  }

  confirm(): void {
    this.nzMessageService.info('clicked confirm');
    this.currentEditIndex = -1;

  }
}

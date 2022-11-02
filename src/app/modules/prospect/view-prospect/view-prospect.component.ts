import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProspectService} from "../../../shared/services/prospect.service";
import {NzInputModule} from "ng-zorro-antd/input";
import {PositionsSelectComponent} from "../../../shared/components/positions-select/positions-select.component";
import {Positions} from "../../../shared/interfaces/positions.interface";
import {Prospect} from "../../../shared/interfaces/prospect.interface";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TabsComponent} from "../tabs/tabs.component";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";

@Component({
  selector: 'app-view-prospect',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, ReactiveFormsModule, NzInputModule, PositionsSelectComponent, NzPopconfirmModule, NzButtonModule, TabsComponent, NzDropDownModule, FormsModule],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
})
export class ViewProspectComponent implements OnInit {

  @Input() dataSet: Prospect[] = [];
  @Input() originalDataSet: Prospect[] = [];
  @Input() achievedTable: boolean = false;
  @Input() isLoading: boolean = false;
  @Output() prospectArchived: EventEmitter<Prospect> = new EventEmitter<Prospect>()
  @Output() prospectUnArchived: EventEmitter<Prospect> = new EventEmitter<Prospect>()
  listOfColumns = {
    first_name: 'First Name', last_name: 'Last Name', position: 'Position', classification: 'Classification/Year',
    state: 'State/Province', school: 'School/Team', video_link: 'Video Link'
  };

  visible = {
    first_name: false, last_name: false, position: false, classification: false,
    state: false, school: false, video_link: false
  };
  searchValue = {
    first_name: '', last_name: '', position: '', classification: '',
    state: '', school: '', video_link: ''
  };
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



  currentEditIndex: number;
  currentPosition: number;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef, private notification: NzNotificationService,
              private nzMessageService: NzMessageService) {
  }

  ngOnInit(): void {
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

    this.prospectSer.editProspect(this.dataSet[i].id, {...this.dataSet[i], ...this.prospectForm.value}).subscribe(
      x => {
        this.notification.success('Success', 'Your changes has been saved!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
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

    this.prospectSer.deleteProspect(this.dataSet[i].id).subscribe(
      x => {
        this.notification.success('Success', 'Selected Prospect has been deleted!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
        // this.dataSet.splice(i,1)
        this.dataSet = this.dataSet.map((item) => {
          if (item.id == this.dataSet[i].id) {
            return
          }
          return item
        }).filter(e => e)
        this.currentEditIndex = -1
        this.cdr.detectChanges();
      },
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

  isArchive(i: number) {
    this.prospectSer.editProspect(this.dataSet[i].id, {...this.dataSet[i], archived: true}).subscribe(
      x => {
        this.notification.success('Success', 'Your changes has been archived!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
        this.prospectArchived.emit(this.dataSet[i]);

        this.dataSet = this.dataSet.map((item) => {
          if (item.id == this.dataSet[i].id) {
            return
          }
          return item
        }).filter(e => e)
        this.currentEditIndex = -1
        this.cdr.detectChanges();

      }
    )
  }


  isUnArchive(i: number) {
    this.prospectSer.unArchiveProspect(this.dataSet[i].id).subscribe(
      x => {
        this.notification.success('Success', 'Your changes has been unarchived!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
        this.prospectUnArchived.emit(this.dataSet[i]);

        this.dataSet = this.dataSet.map((item) => {
          if (item.id == this.dataSet[i].id) {
            return
          }
          return item
        }).filter(e => e)
        this.currentEditIndex = -1
        this.cdr.detectChanges();

      }
    )
  }

  reset(key) {
    this.searchValue[key] = ''

    this.search(key);
  }

  search(key) {
    console.log(this.dataSet)
    this.visible[key] = false;
    console.log({key})
    this.dataSet = this.originalDataSet.filter((item: Prospect) => item[key].indexOf(this.searchValue[key]) !== -1);
    console.log(this.dataSet)
    console.log(this.searchValue)
  }
}

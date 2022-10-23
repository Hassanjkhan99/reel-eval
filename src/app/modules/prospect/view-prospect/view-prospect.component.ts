import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ProspectService} from "../../../shared/services/prospect.service";
import {NzInputModule} from "ng-zorro-antd/input";
import {Result} from "../../../shared/interfaces/prospect.interface";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-view-prospect',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, ReactiveFormsModule, NzInputModule],
  templateUrl: './view-prospect.component.html',
  styleUrls: ['./view-prospect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProspectComponent implements OnInit {
  prospectForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    position_name: new FormControl(''),
    classification: new FormControl(''),
    state: new FormControl(''),
    school: new FormControl(''),
    video_link: new FormControl(''),
    archived: new FormControl(false)
  });

  dataSet: Result[] = [];


  currentEditIndex: number;

  constructor(private prospectSer: ProspectService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getProspect();
  }

  isEdit(i: number) {
    console.log(this.dataSet[i]);
    this.currentEditIndex = i;
    this.prospectForm.setValue({
      first_name: this.dataSet[i].first_name,
      last_name: this.dataSet[i].last_name,
      position_name: this.dataSet[i].position_name,
      classification: this.dataSet[i].classification,
      state: this.dataSet[i].state,
      school: this.dataSet[i].school,
      video_link: this.dataSet[i].video_link,
      archived: false
    })

  }

  isSave(i: number) {
    this.prospectSer.editProspect(this.dataSet[1].id, this.prospectForm.value).subscribe(
      x => {
        console.log(x);
      }
    )
    this.cdr.detectChanges();
  }

  getProspect() {
    this.prospectSer.getProspects().pipe(map(value => value.results)).subscribe(
      x => {
        this.dataSet = x;
        this.cdr.detectChanges();

      }
    )
  }
}

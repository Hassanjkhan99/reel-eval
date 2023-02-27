import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BugsListService} from '../../shared/services/bugs-list.service';
import {BugsList} from '../../shared/interfaces/bugs-list';
import {NzTableModule} from 'ng-zorro-antd/table';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Status} from '../../shared/enums/status';

@Component({
  selector: 'app-bugs-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzSelectModule,
    NzIconModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.scss'],
})
export class BugsListComponent implements OnInit {
  listData: BugsList[] = [];
  currentEditIndex: number;
  statusEnum = Status;
  status = new FormControl('');

  constructor(
    private bugsListService: BugsListService,
    public authService: AuthenticationService,
    private nzMessageService: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.bugsListService.getBugsListData().subscribe((data) => {
      this.listData = data;
    });
  }

  isEdit(i: number) {
    this.currentEditIndex = i;
    this.status.setValue(this.listData[i].status);
  }

  isSave(i: number) {
    this.bugsListService.editBugStatus(this.listData[i].id, this.status.value).subscribe(data => {
      this.listData[i].status = data.status
    })
    this.currentEditIndex = -1
  }

  cancel(): void {
    this.nzMessageService.info('clicked cancel');
  }

  confirm(): void {
    this.nzMessageService.info('clicked confirm');
    this.currentEditIndex = -1;
  }
}

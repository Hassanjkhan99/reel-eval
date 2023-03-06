import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BugsListService} from '../../shared/services/bugs-list.service';
import {NzTableModule} from 'ng-zorro-antd/table';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Status} from '../../shared/enums/status';
import {NotificationService} from "../../shared/services/notification.service";
import {LoadingService} from "../../shared/services/loading.service";

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
  currentEditIndex: number;
  statusEnum = Status;
  status = new FormControl('');

  constructor(
    public bugsListService: BugsListService,
    private notificationService: NotificationService,
    public authService: AuthenticationService,
    private nzMessageService: NzMessageService,
    public loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this.bugsListService.getBugsListData()
  }

  isEdit(i: number) {
    this.currentEditIndex = i;
    this.status.setValue(this.bugsListService.listData[i].status);
  }

  isSave(i: number) {
    this.bugsListService.editBugStatus(this.bugsListService.listData[i].id, this.status.value).subscribe(data => {
      this.bugsListService.listData[i].status = data.status
    })
    this.currentEditIndex = -1
  }

  isDelete(i: number) {
    this.bugsListService.deleteTicket(this.bugsListService.listData[i].id).subscribe(ticket => {
      this.notificationService.success(
        'Success',
        'Selected Ticket has been deleted!'
      );
      this.bugsListService.listData = this.bugsListService.listData.filter(e => e != this.bugsListService.listData[i])
    })
  }

  cancel(): void {
    this.nzMessageService.info('clicked cancel');
  }

  confirm(): void {
    this.nzMessageService.info('clicked confirm');
    this.currentEditIndex = -1;
  }
}

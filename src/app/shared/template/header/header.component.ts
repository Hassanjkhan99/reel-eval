import {Component} from '@angular/core';
import {ThemeConstantService} from '../../services/theme-constant.service';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {BugsListService} from "../../services/bugs-list.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NzUploadFile} from "ng-zorro-antd/upload";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {

  searchVisible: boolean = false;
  quickViewVisible: boolean = false;
  isFolded: boolean;
  isExpand: boolean;
  isVisible = false;
  bugForm = new FormGroup({
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  })
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor(private themeService: ThemeConstantService, public authService: AuthenticationService,
              private router: Router, private notification: NzNotificationService, private bugListService: BugsListService) {
  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }


  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigateByUrl(`authentication/login`);
        this.notification.success('Success', 'Successfully Logged Out', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000,
        })
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {

    this.bugListService.postBug({
      subject: this.bugForm.controls.subject.value,
      message: this.bugForm.controls.message.value
    }, this.fileList).subscribe()
    this.bugForm.reset()
    this.isVisible = false;
  }

  handleCancel(): void {
    this.bugForm.reset()
    this.isVisible = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };


}

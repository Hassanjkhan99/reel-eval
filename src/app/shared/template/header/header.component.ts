import {Component} from '@angular/core';
import {ThemeConstantService} from '../../services/theme-constant.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {BugsListService} from '../../services/bugs-list.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {changeUserPass} from '../../interfaces/authentication.interface';
import {NotificationService} from '../../services/notification.service';

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
  isVisiblePass = false;
  oldPassVisible = false;
  newPassVisible1 = false;
  newPassVisible2 = false;
  bugForm = new FormGroup({
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  });
  changePasswordForm: FormGroup;
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor(
    private themeService: ThemeConstantService,
    public authService: AuthenticationService,
    private router: Router,
    private notification: NotificationService,
    private bugListService: BugsListService
  ) {
  }

  get old_password() {
    return this.changePasswordForm.controls.old_password;
  }

  get new_password1() {
    return this.changePasswordForm.controls.new_password1;
  }

  get new_password2() {
    return this.changePasswordForm.controls.new_password2;
  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    this.changePasswordForm = new FormGroup({
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password2: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password1: new FormControl('', [
        Validators.required,
        this.confirmationValidator,
      ]),
    });
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
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl(`authentication/login`);
      this.notification.success('Success', 'Successfully Logged Out');
    });
  }

  showModalPassword(): void {
    this.isVisiblePass = true;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.bugListService
      .postBug(
        {
          subject: this.bugForm.controls.subject.value,
          message: this.bugForm.controls.message.value,
        },
        this.fileList
      )
      .subscribe((e) => {
        this.bugListService.getBugsListData();
        this.notification.success(
          'Success',
          'Your request was successfully submitted, please check the status of your request.'
        );
        this.bugForm.reset();
        this.fileList = [];
      });
    this.isVisible = false;
  }

  handleCancel(): void {
    this.bugForm.reset();
    this.fileList = [];
    this.isVisible = false;
  }

  okPassword(): void {
    this.authService
      .changeUserPassword(this.changePasswordForm.value as changeUserPass)
      .subscribe(
        (x) => {
          this.notification.success('Success', x.detail);
          this.changePasswordForm.reset();
          this.isVisiblePass = false;
        },
        (error) => {
          error = error.error;
          console.log(error);
          for (const errorKey in error) {
            const arr: string[] = error[errorKey];
            arr.forEach((msg) => {
              this.changePasswordForm.get(errorKey).setErrors({msg});
              this.notification.error('Failed', msg);
            });
          }
          this.changePasswordForm.controls.new_password1.reset()
        }
      );

  }

  cancelPassword(): void {
    this.changePasswordForm.reset();
    this.isVisiblePass = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  private confirmationValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (
      control.value !== this.changePasswordForm.controls.new_password2.value
    ) {
      return {confirm: true, error: true};
    }
  };
}

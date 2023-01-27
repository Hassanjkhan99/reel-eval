import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../shared/services/notification.service';
import {LoadingService} from "../../shared/services/loading.service";
import {UserMe} from "../../shared/interfaces/authentication.interface";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordComponent implements OnInit {
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private notification: NotificationService,
    public loadingService: LoadingService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const isAuth = await this.checkUser()
    if (isAuth) {
      this.router.navigate(['app/dashboard']);
    }
  }

  async checkUser(): Promise<UserMe | undefined> {
    return await this.authService.checkLogin().toPromise()
  }

  submitForm() {
    this.authService.forget(this.email.value).subscribe((e) => {
      this.router.navigateByUrl(`authentication/login`);
      this.notification.success(
        'Success',
        'An email has been sent to your email address'
      );
    });
  }
}

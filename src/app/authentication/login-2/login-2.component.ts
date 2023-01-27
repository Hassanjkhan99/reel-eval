import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../shared/services/notification.service";
import {LoadingService} from "../../shared/services/loading.service";
import {UserMe} from "../../shared/interfaces/authentication.interface";


@Component({
  templateUrl: './login-2.component.html',

})

export class Login2Component implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;
  password: string;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router,
              private notification: NotificationService, public loadingService: LoadingService
  ) {
  }

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        this.notification.success('Success', 'Login Successful!')
        console.log(response);
        this.router.navigateByUrl(`app/dashboard/home`);
      }
    );
  }

  async ngOnInit(): Promise<void> {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    const isAuth = await this.checkUser()
    if (isAuth) {
      this.router.navigate(['app/dashboard']);
    }
  }

  async checkUser(): Promise<UserMe | undefined> {
    return await this.authService.checkLogin().toPromise()
  }

}

import {Component} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";


@Component({
  templateUrl: './login-2.component.html',

})

export class Login2Component {
  loginForm: FormGroup;
  passwordVisible = false;
  password: string;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router,
              private notification: NzNotificationService) {
  }

  submitForm(): void {

    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        this.notification.success('Success', 'Login Successful!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
        console.log(response);
        this.router.navigateByUrl(`prospect/view`);
      }
    );

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }


}

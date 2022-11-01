import {Component} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";


@Component({
  templateUrl: './sign-up-2.component.html',

})

export class SignUp2Component {

  signUpForm: FormGroup;
  passwordVisible = false;
  passwordVisible2 = false;


  constructor(private fb: FormBuilder, private authService: AuthenticationService, private notification: NzNotificationService, private router: Router) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      club_name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, this.confirmationValidator]],
      agree: [false]
    });
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.signUpForm.controls.password2.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.signUpForm.controls.password1.value) {
      return {confirm: true, error: true};
    }
  }

  submitForm(): void {

    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();

    }
    this.authService.signup(this.signUpForm.value).subscribe(
      x => {
        this.notification.success('Success', 'Your Account has been created!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        });
        this.router.navigateByUrl('authentication/login')
      },
      (error) => {
        error = error.error;
        console.log(error)
        if (error['detail']) {
          this.notification.error('Failed', error['detail'], {
            nzPlacement: 'bottomRight',
            nzAnimate: true,
            nzPauseOnHover: true,
            nzDuration: 2000
          })
          this.router.navigateByUrl('app/dashboard/home')
          return;
        }
        for (const errorKey in error) {
          const arr: string[] = error[errorKey];
          arr.forEach((msg) => {
            // this.signUpForm.get(errorKey).setErrors({msg})

            this.notification.error('Failed', msg, {
              nzPlacement: 'bottomRight',
              nzAnimate: true,
              nzPauseOnHover: true,
              nzDuration: 2000
            })
          });
        }
      }
    );

  }

  ngOnInit(): void {

  }
}



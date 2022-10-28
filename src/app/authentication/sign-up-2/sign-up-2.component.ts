import {Component} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {NzNotificationService} from "ng-zorro-antd/notification";


@Component({
  templateUrl: './sign-up-2.component.html',

})

export class SignUp2Component {

  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private notification: NzNotificationService) {
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
    this.authService.postSignup(this.signUpForm.value).subscribe(
      x => {
        this.notification.success('Success', 'Your Account has been created!', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
        console.log(x);
      }
    );

  }

  ngOnInit(): void {

  }
}

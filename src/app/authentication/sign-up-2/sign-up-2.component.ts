import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../shared/services/notification.service';
import {LoadingService} from "../../shared/services/loading.service";
import {UserMe} from "../../shared/interfaces/authentication.interface";

@Component({
  templateUrl: './sign-up-2.component.html',
  styleUrls: ['./sign-up-2.component.scss']
})
export class SignUp2Component {
  signUpForm: FormGroup;
  passwordVisible = false;
  passwordVisible2 = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private notification: NotificationService,
    private router: Router,
    public loadingService: LoadingService
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      club_name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password1: ['', [Validators.required, Validators.minLength(8), this.confirmationValidator2]],
      password2: ['', [Validators.required, this.confirmationValidator]],
      agree: [false],
    });
  }

  get username() {
    return this.signUpForm.controls.username;
  }

  get email() {
    return this.signUpForm.controls.email;
  }

  get password1() {
    return this.signUpForm.controls.password1;
  }

  get password2() {
    return this.signUpForm.controls.password2;
  }

  get club_name() {
    return this.signUpForm.controls.club_name;
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.signUpForm.controls.password2.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.signUpForm.controls.password1.value || control.value !== this.signUpForm.controls.password2.value) {
      return {confirm: true, error: true};
    }
  };
  confirmationValidator2 = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.signUpForm.controls.password2.value) {
      this.password2.setErrors({confirm: true});
    }
  };

  submitForm(): void {
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }
    this.authService.signup(this.signUpForm.value).subscribe(
      () => {
        this.notification.success('Success', 'Your Account has been created!');
        this.router.navigateByUrl('authentication/login').then();
      },
      (error) => {
        error = error.error;
        console.log(error);
        for (const errorKey in error) {
          const arr: string[] = error[errorKey];
          arr.forEach((msg) => {
            this.signUpForm.get(errorKey).setErrors({msg});
            this.notification.error('Failed', msg);
          });
        }
      }
    );
  }

  navToLogin() {
    this.router.navigateByUrl('authentication/login').then();
  }

  async ngOnInit(): Promise<void> {
    const isAuth = await this.checkUser()
    if (isAuth) {
      this.router.navigate(['app/dashboard']).then();
    }
  }

  async checkUser(): Promise<UserMe | undefined> {
    return await this.authService.checkLogin().toPromise()
  }
}

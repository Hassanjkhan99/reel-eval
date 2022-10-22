import {Component} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";


@Component({
  templateUrl: './sign-up-2.component.html',

})

export class SignUp2Component {

  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
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

  submitForm(value: {
    first_name: string; last_name: string; club_name: string; username: string;
    email: string; password1: string; password2: string;
  }): void {
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();

    }
    this.authService.postSignup(value).subscribe(
      x => {
        console.log(x);
      }
    );

  }

  ngOnInit(): void {

  }
}

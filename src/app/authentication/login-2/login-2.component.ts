import {Component} from '@angular/core'
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from "../../shared/services/authentication.service";


@Component({
  templateUrl: './login-2.component.html',

})

export class Login2Component {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {
  }

  submitForm(value: { username: string; password: string; }): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.authService.proceedLogin(value).subscribe(
      response=>{
        console.log(response);
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

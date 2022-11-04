import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {Login2Component} from './login-2/login-2.component';
import {SignUp2Component} from './sign-up-2/sign-up-2.component';
import {Error1Component} from './error-1/error-1.component';
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";

const routes: Routes = [
  {
    path: 'login',
    component: Login2Component,
    data: {
      title: 'Login'
    }
  }, {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    data: {
      title: 'forget-password'
    }
  },
  {
    path: 'sign-up',
    component: SignUp2Component,
    data: {
      title: 'Sign Up'
    }
  },
  {
    path: 'error',
    component: Error1Component,
    data: {
      title: 'Error'
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthenticationRoutingModule { }

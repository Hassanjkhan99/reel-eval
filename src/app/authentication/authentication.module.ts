import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { Login2Component } from './login-2/login-2.component';
import { SignUp2Component } from './sign-up-2/sign-up-2.component';
import { Error1Component } from './error-1/error-1.component';
import { Error2Component } from './error-2/error-2.component';

const antdModule= [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule
]

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      AuthenticationRoutingModule,
      ...antdModule,
    ],
    declarations: [
      Login2Component,
      SignUp2Component,
      Error1Component,
      Error2Component,
    ]
})

export class AuthenticationModule {}

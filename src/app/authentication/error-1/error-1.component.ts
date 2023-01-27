import {Component} from '@angular/core'
import {Router, RouterLink} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {UserMe} from "../../shared/interfaces/authentication.interface";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  templateUrl: './error-1.component.html',
  imports: [
    RouterLink,
    NzButtonModule
  ],
  standalone: true
})

export class Error1Component {

  constructor(private router: Router, private authService: AuthenticationService) {
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

  redirect() {
    this.router.navigateByUrl('authentication/login')
  }
}

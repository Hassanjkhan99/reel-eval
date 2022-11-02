import {Component} from '@angular/core'
import {Router, RouterLink} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  templateUrl: './error-1.component.html',
  imports: [
    RouterLink,
    NzButtonModule
  ],
  standalone: true
})

export class Error1Component {

  constructor(private router: Router) {
  }

  redirect() {
    this.router.navigateByUrl('authentication/login')
  }
}

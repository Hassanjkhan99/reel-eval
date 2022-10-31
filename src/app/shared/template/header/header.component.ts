import {Component} from '@angular/core';
import {ThemeConstantService} from '../../services/theme-constant.service';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  searchVisible: boolean = false;
  quickViewVisible: boolean = false;
  isFolded: boolean;
  isExpand: boolean;

  constructor(private themeService: ThemeConstantService, private authService: AuthenticationService,
              private router: Router, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }


  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigateByUrl(`authentication/login`);
        this.notification.success('Success', 'Successfully Logged Out', {
          nzPlacement: 'bottomRight',
          nzAnimate: true,
          nzPauseOnHover: true,
          nzDuration: 3000
        })
      }
    );
  }
}

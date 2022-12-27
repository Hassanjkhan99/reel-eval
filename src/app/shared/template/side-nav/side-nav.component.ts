import {Component} from '@angular/core';
import {ROUTES} from './side-nav-routes.config';
import {ThemeConstantService} from '../../services/theme-constant.service';
import {SideNavInterface} from '../../interfaces/side-nav.type';
import {AuthenticationService} from '../../services/authentication.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-sidenav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  public menuItems: SideNavInterface[];
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;

  constructor(
    private themeService: ThemeConstantService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        const permission = user.groups[0];
        this.menuItems = ROUTES.filter((menuItem) =>
          menuItem.permission.includes(permission)
        );
        this.menuItems.forEach(
          (menuItem, index) =>
            (this.menuItems[index].submenu = menuItem.submenu.filter((item) =>
              item.permission.includes(permission)
            ))
        );
        console.log(this.menuItems);
      });

    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
  }

  closeMobileMenu(): void {
    if (window.innerWidth < 992) {
      this.isFolded = false;
      this.isExpand = !this.isExpand;
      this.themeService.toggleExpand(this.isExpand);
      this.themeService.toggleFold(this.isFolded);
    }
  }
}

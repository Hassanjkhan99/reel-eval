import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from "../../shared/guard/auth.guard";

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    data: {
      title: 'Dashboard ',
      headerDisplay: "none"
    },
    canActivate: [AuthGuard]

  }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }

import {Routes} from '@angular/router';
import {ViewProspectComponent} from "../../modules/prospect/view-prospect/view-prospect.component";

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
      loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    },
  {
    path: 'staff/add',
    loadComponent: () => import('../../modules/staff/add-staff/add-staff.component').then(c => c.AddStaffComponent),
    data: {
      label: 'staff',
      path: 'staff/add'
    }
  }
  ,
  {
    path: 'prospect/view',
    loadComponent: () => import('../../modules/prospect/view-prospect/view-prospect.component').then(c => c.ViewProspectComponent),
    data: {
      label: 'prospect',
      path: 'prospect/view'
    }
  }
];

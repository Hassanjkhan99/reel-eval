import {Routes} from '@angular/router';
import {ViewProspectComponent} from "../../modules/prospect/view-prospect/view-prospect.component";
import {TableStaffComponent} from "../../modules/staff/table-staff/table-staff.component";

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
    path: 'staff/view',
    loadComponent: () => import('../../modules/staff/table-staff/table-staff.component').then(c => c.TableStaffComponent),
    data: {
      label: 'staff',
      path: 'staff/view'
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
  },
  {
    path: 'prospect/add',
    loadComponent: () => import('../../modules/prospect/add-prospect/add-prospect.component').then(c => c.AddProspectComponent),
    data: {
      label: 'prospect',
      path: 'prospect/add'
    }
  }
];

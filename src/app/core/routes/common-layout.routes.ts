import {Routes} from '@angular/router';
import {AuthGuard} from "../../shared/guard/auth.guard";

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
      loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [AuthGuard]
    },
  {
    path: 'staff/add',
    loadComponent: () => import('../../modules/staff/add-staff/add-staff.component').then(c => c.AddStaffComponent),
    data: {
      label: 'staff',
      path: 'staff/add'
    },
    canActivate: [AuthGuard]

  }
  ,
  {
    path: 'staff/view',
    loadComponent: () => import('../../modules/staff/table-staff/table-staff.component').then(c => c.TableStaffComponent),
    data: {
      label: 'staff',
      path: 'staff/view'
    },
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'prospect/view',
    loadComponent: () => import('../../modules/prospect/tabs/tabs.component').then(c => c.TabsComponent),
    data: {
      label: 'prospect',
      path: 'prospect/view'
    },
    canActivate: [AuthGuard]

  },
  {
    path: 'prospect/add',
    loadComponent: () => import('../../modules/prospect/add-prospect/add-prospect.component').then(c => c.AddProspectComponent),
    data: {
      label: 'prospect',
      path: 'prospect/add'
    },
    canActivate: [AuthGuard]

  },

  {
    path: 'traits',
    loadComponent: () => import('../../modules/traits/traits.component').then(c => c.TraitsComponent),
    data: {
      label: 'traits',
      path: 'traits'
    },
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'app/dashboard'

  },

];

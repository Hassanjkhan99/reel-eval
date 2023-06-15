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
    path: 'prospects',
    loadComponent: () => import('../../modules/prospect/tabs/tabs.component').then(c => c.TabsComponent),
    data: {
      label: 'prospect',
      path: 'prospects'
    },
    canActivate: [AuthGuard]

  },
  // {
  //   path: 'prospect/add',
  //   loadComponent: () => import('../../modules/prospect/add-prospect/add-prospect.component').then(c => c.AddProspectComponent),
  //   data: {
  //     label: 'prospect',
  //     path: 'prospect/add'
  //   },
  //   canActivate: [AuthGuard]
  //
  // },

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
    path: 'customers',
    loadComponent: () => import('../../modules/customers/customers.component').then(c => c.CustomersComponent),
    data: {
      label: 'customers',
      path: 'customers'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'grade',
    loadComponent: () => import('../../modules/grading/pre-grading/pre-grading.component').then(c => c.PreGradingComponent),
    data: {
      label: 'grade',
      path: 'grade'
    },
    canActivate: [AuthGuard]
  }, {
    path: 'grading',
    loadComponent: () => import('../../modules/grading/grading/grading.component').then(c => c.GradingComponent),
    data: {
      label: 'grading',
      path: 'grading'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'traits-selection',
    loadComponent: () => import('../../modules/grading/traits-selection/traits-selection.component').then(c => c.TraitsSelectionComponent),
    data: {
      label: 'traits-selection',
      path: 'traits-selection'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadComponent: () => import('../../modules/report/trajectory-report/trajectory-report.component').then(c => c.TrajectoryReportComponent),
    data: {
      label: 'report',
      path: 'report'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'academy-trajectory-report',
    loadComponent: () => import('../../modules/report/academy-trajectory-report/academy-trajectory-report.component').then(c => c.AcademyTrajectoryReportComponent),
    data: {
      label: 'academy-trajectory-report',
      path: 'academy-trajectory-report'
    },
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'quadrant-report',
  //   loadComponent: () => import('../../modules/report/quadrant-report/quadrant-report.component').then(c => c.QuadrantReportComponent),
  //   data: {
  //     label: 'quadrant-report',
  //     path: 'quadrant-report'
  //   },
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'prospect-report',
    loadComponent: () => import('../../modules/report/prospect-report/prospect-report.component').then(c => c.ProspectReportComponent),
    data: {
      label: 'prospect-report',
      path: 'prospect-report'
    },
    canActivate: [AuthGuard]
  }, {
    path: 'comparison-report',
    loadComponent: () => import('../../modules/report/comparison-report/comparison-report.component').then(c => c.ComparisonReportComponent),
    data: {
      label: 'comparison-report',
      path: 'comparison-report'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'ticket-list',
    loadComponent: () => import('../../modules/bugs-list/bugs-list.component').then(c => c.BugsListComponent),
    data: {
      label: 'Ticket List',
      path: 'ticket-list'
    },
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'app/dashboard'

  },

];

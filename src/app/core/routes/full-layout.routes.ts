import {Routes} from '@angular/router';

export const FullLayout_ROUTES: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: '**',
    redirectTo: 'authentication'
  }
];

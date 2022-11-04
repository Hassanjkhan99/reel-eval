import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';


import {CommonLayoutComponent} from "./core/layouts/common-layout/common-layout.component";
import {FullLayoutComponent} from "./core/layouts/full-layout/full-layout.component";
import {CommonLayout_ROUTES} from "./core/routes/common-layout.routes";
import {FullLayout_ROUTES} from "./core/routes/full-layout.routes";

const appRoutes: Routes = [
  {
    path: 'app',
    component: CommonLayoutComponent,
    children: CommonLayout_ROUTES
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: FullLayout_ROUTES
  }, {
    path: '**',
    redirectTo: 'app'
  }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {
}

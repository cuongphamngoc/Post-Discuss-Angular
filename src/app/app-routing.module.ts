import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainlayoutComponent } from './shared/layout/mainlayout/mainlayout.component';
import { AuthlayoutComponent } from './shared/layout/authlayout/authlayout.component';
import { ErrorComponent } from './features/error/error.component';

const routes: Routes = [
  { path: '',component:MainlayoutComponent, loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
  { path: '',component:AuthlayoutComponent, loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

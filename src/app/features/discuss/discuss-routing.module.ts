import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscussComponent } from './discuss.component';
import { DiscussFormComponent } from './discuss-form/discuss-form.component';
import { DiscussDetailComponent } from './discuss-detail/discuss-detail.component';
const routes: Routes = [
  {path:'',component: DiscussComponent},
  {path:'new',component:DiscussFormComponent},
  {path:':slug',component:DiscussDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussRoutingModule { }

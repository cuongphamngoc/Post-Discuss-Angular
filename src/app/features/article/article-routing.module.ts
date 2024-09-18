import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleFormComponent } from './article-form/article-form.component';

const routes: Routes = [
    { path: 'new',component:ArticleFormComponent},
    {path:':slug', component: ArticleDetailComponent},
    { path: '',component:ArticleListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }

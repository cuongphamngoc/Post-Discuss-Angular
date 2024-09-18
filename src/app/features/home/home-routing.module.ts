import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from '../article/article-list/article-list.component';
const routes: Routes = [
  { path: '', redirectTo: 'article',pathMatch:'full' },
    { path: 'article', loadChildren:()=> import('../article/article.module').then(m => m.ArticleModule) },
    { path: 'discuss', loadChildren:()=> import('../discuss/discuss.module').then(m => m.DiscussModule )},
    { path: 'chatbox', loadChildren:()=> import('../chatbox/chatbox.module').then(m => m.ChatboxModule) }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}

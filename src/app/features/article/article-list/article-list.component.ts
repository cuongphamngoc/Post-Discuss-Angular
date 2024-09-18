import { Component } from '@angular/core';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/Article';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent {
  curentTab = 'Newest';
  currentTotalLength = 100;
  curentPage=0;
  currentPageSize = 10;
  articles : Article[] = [];
  tabs = ['Newest', 'Editor choice', 'Trending','My Bookmarks','Video',];
  constructor(private articleService: ArticleService){
     this.articleService.getAllArticlesByNewest( this.curentPage, this.currentPageSize).subscribe(
      res => {
        if(res.data){
          this.articles = res.data?.articles;
          this.curentPage = res.data?.currentPage;
          this.currentTotalLength = res.data?.totalArticles;
        }
      }
    )
  }
  onTabChange($event:any){
    const tab = $event.tab.textLabel;
    if(tab === this.curentTab) return;
    console.log(tab);



    this.curentTab = tab;

  }
  onPageChange($event: PageEvent){
    this.currentPageSize= $event.pageSize;
    this.curentPage = $event.pageIndex;
  }
  saveBookMark(id:number){
    console.log(id);



  }



}

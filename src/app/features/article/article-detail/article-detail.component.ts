import { Component, OnInit } from '@angular/core';
import { Article } from '../../../core/models/Article';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { map, switchMap, tap } from 'rxjs';
import { ResponseData } from '../../../core/models/ResponeData';
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article!:Article|undefined ;
  constructor(private route: ActivatedRoute, private articleService:ArticleService){}
  ngOnInit():void{
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        console.log(slug);
        this.articleService.getArticleBySlug(slug).subscribe((response) => {
          this.article = response.data; // Truy cập thuộc tính 'data'
          console.log(this.article); // In ra thông tin bài viết
        });
      }
    });
  }
}

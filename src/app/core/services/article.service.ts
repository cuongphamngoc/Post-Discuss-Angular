import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../models/Article';
import { ResponseData } from '../models/ResponeData';
import { PaginatedArticleResponseDTO } from '../models/PaginatedArticleResponseDTO';
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  apiUrl = 'http://localhost:8080/article/';
  constructor(private http:HttpClient) { }

  getAllArticlesByNewest(page : number, pageSize: number) :Observable<ResponseData<PaginatedArticleResponseDTO>> {
    return this.http.get<ResponseData<PaginatedArticleResponseDTO>>(`http://localhost:8080/article/newest?pagesize=${pageSize}&pageNum=${page}` );
  }
  getArticlesByTag(tag: string) {

  }
  getArticleBySlug(slug: string) : Observable<ResponseData<Article>>{
    return this.http.get<ResponseData<Article>>(`http://localhost:8080/article/${slug}`);
  }
  getArticle(): Observable<Article[]>{
    return this.http.get<Article[]>(`http://localhost:8080/article`);
  }
  saveArticle(articleForm: any): Observable<ResponseData<Article>> {
    // Gửi trực tiếp giá trị của form, không cần bọc trong đối tượng
    console.log(articleForm.value);
    return this.http.post<ResponseData<Article>>(this.apiUrl, articleForm.value);
  }
}

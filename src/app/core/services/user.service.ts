import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from '../models/ResponeData';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = "http://localhost:8080/user";

  constructor(private http: HttpClient) { }

  getUser(userId: number): Observable<ResponseData<User>>{
    return this.http.get<ResponseData<User>>(`${this.API_URL}/${userId}`);
  }
  bookmarkArticle(articleId: number): Observable<ResponseData<null>>{
    return this.http.post<ResponseData<null>>(`${this.API_URL}/bookmark`, {articleId});
  }
}

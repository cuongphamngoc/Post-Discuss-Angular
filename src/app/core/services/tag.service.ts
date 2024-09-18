import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from '../models/ResponeData';
import { Observable } from 'rxjs';
import { Tag } from '../models/Tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  API_URL = 'http://localhost:8080/tag/';
  constructor(private http: HttpClient) {

   }
   getTags(): Observable<ResponseData<Tag[]>>{
      return this.http.get<ResponseData<Tag[]>>(this.API_URL);

   }
}

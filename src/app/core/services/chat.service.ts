import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/ChatMessage.model';
import { ResponseData } from '../models/ResponeData';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private URL_API = 'http://localhost:8080/message/';

  constructor(private http:HttpClient) { }

  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ResponseData<ChatMessage[]>>(this.URL_API).pipe(
      map(response => response.data || [])
    );
  }
  getMessageFromReply(replyId:number): Observable<ChatMessage[]>{
    return this.http.get<ResponseData<ChatMessage[]>>(`${this.URL_API}reply/${replyId}`).pipe(
      map(response => response.data || [])
    );
  }
}

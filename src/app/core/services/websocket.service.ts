import { Injectable } from '@angular/core';
import { Client, Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { Subject,Observable } from 'rxjs';
import { tap,catchError,map,from, switchMap } from 'rxjs';
import { StompSubscription } from '@stomp/stompjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import {  Router } from '@angular/router';
import { ChatMessage } from '../models/ChatMessage.model';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private messagesSubject$ = new Subject<ChatMessage>();
  private chatSubscription: StompSubscription | undefined;

  constructor(private storage:StorageService, private authService:AuthService,private router:Router) {
    const accessToken = this.storage.getFromStorage('access_token'); // Lấy token từ localStorage

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}` // Thêm header Authorization
      }
    });

    this.stompClient.onConnect = this.onConnect.bind(this);
    this.stompClient.onStompError = this.onStompError.bind(this);

    this.stompClient.activate();

  }

  private onConnect(frame: any): void {
    console.log('Kết nối thành công: ' + frame);

    // Đăng ký để nhận tin nhắn từ topic /topic/chat
    this.chatSubscription = this.stompClient.subscribe('/topic/chat', this.onMessageReceived.bind(this));

  }

  private onStompError(frame: any): void {
    console.error(frame);
  }

  private onMessageReceived(message: Message): void {
    console.log('Nhận được tin nhắn: ', message.body);
    this.messagesSubject$.next(JSON.parse(message.body));
  }
  private isTokenExpired(token: string): boolean {
    // Decode token and check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  private refreshTokenIfNeeded(): Observable<any> {
    const token = localStorage.getItem('access_token');
    if (token && this.isTokenExpired(token)) {
      return this.authService.refreshToken().pipe(
        tap((response: any) => {
          this.storage.setToStorage('access_token', response.data.accessToken);
          this.storage.setToStorage('refresh_token', response.data.refreshToken);
        }),
        catchError(() => {
          console.error('Error refreshing token');
          this.authService.logout();
          this.router.navigate(['/login']);
          return from([]);
        })
      );
    }
    return from([null]);
  }
  sendMessage(message: string, replyid? :number, type?: string): void {

    this.refreshTokenIfNeeded().pipe(
      switchMap(() => {
        const token = localStorage.getItem('access_token');
        if(!type) type= "TEXT";
        if (this.stompClient && this.stompClient.connected) {
          let payload = ""
          if(replyid){
            payload = JSON.stringify({content:message,
              repliedMessageId:replyid, type: type
            });
          }
          else payload = JSON.stringify({content:message, type: type});

          return new Observable(observer => {
            this.stompClient.publish({
              destination: '/app/chat',
              body: payload,
              headers: { Authorization: 'Bearer ' + token }
            });
            observer.complete();
          });
        }
        return from([]);
      })
    ).subscribe();
  }

  getMessages(): Observable<ChatMessage> {
    return this.messagesSubject$.asObservable();
  }

  disconnect(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    this.stompClient.deactivate();
  }
}

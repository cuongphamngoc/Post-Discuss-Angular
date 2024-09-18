import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebSocketService } from '../../core/services/websocket.service';
import { Observable, Subscription,map,catchError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChatMessage } from '../../core/models/ChatMessage.model';
import { ChatService } from '../../core/services/chat.service';
import { FileUploadService } from '../../core/services/file-upload.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],

})
export class ChatboxComponent implements OnInit, OnDestroy {
  @ViewChild('messageTextarea') messageTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('Chatbox') private messagesContainerRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  messageForm: FormGroup;
  isLoggedIn$: Observable<boolean>;
  selectedReplyMessage: ChatMessage | undefined = undefined;
  hoveredMessageId: number | null = null;
  messages: ChatMessage[] = [];
  DEFAULT_MESSAGE  = 25;
  currentPage : number = 0;
    // Dữ liệu mẫu

  messagesSubscription: Subscription = new Subscription();

  constructor(private fileUploadService:FileUploadService,private wsService: WebSocketService, private fb: FormBuilder,private authService:AuthService, private chatService:ChatService) {
    this.messageForm = fb.group({
      message: [''],
      replyMessageId:[''] // This FormControl will hold the input value

    });
    this.isLoggedIn$ = this.authService.isLoggin();
    this.loadMessages();
  }
  loadMessages(): void{
    this.chatService.getMessages().subscribe((res)=>{
      this.messages = [...res , ...this.messages];
    })
  }

  ngOnInit(): void {
    this.messagesSubscription = this.wsService.getMessages().subscribe((msg: ChatMessage) => {
      this.messages.push(msg);
      console.log('Nhận được tin nhắn: ', msg);
      //this.messages.push(msg);
    });
  }
  autoResize(event:any):void{
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset chiều cao trước khi tính toán lại
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  onKeydown(event:any):void{
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault(); // Ngăn chặn hành động submit
      // Thêm dòng mới vào nội dung khi nhấn Shift + Enter
      const textarea = event.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const value = textarea.value;
      textarea.value = value.slice(0, cursorPos) + '\n' + value.slice(cursorPos);
      textarea.selectionStart = cursorPos + 1;
      textarea.selectionEnd = cursorPos + 1;
    }
    else{
      if(event.key ==='Enter'){
        this.sendMessage(event);
      }
    }
  }
  sendMessage(event: Event): void {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const message = this.messageForm.get('message')?.value;
    console.log('Gửi tin nhắn: ', message);
    console.log(this.messages);
    if (message) {
      const replyToId = this.selectedReplyMessage?.id;
      if(replyToId){
        this.wsService.sendMessage(message,replyToId);
      }
      else{
        this.wsService.sendMessage(message);
      }

      this.scrollToBottom();
      const textarea = this.messageTextarea.nativeElement;
      textarea.style.height = '30px'; // Chiều cao mặc định
      this.messageForm.reset(); // Xóa nội dung ô nhập
      this.clearReply();
    }
  }
  private scrollToBottom(): void {
    const container = this.messagesContainerRef.nativeElement;
    container.scrollTop = container.scrollHeight + 50;
  }
  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
  }
  reactToMessage(message: ChatMessage): void {
    // Logic để thể hiện cảm xúc với tin nhắn
    console.log(`Reacted to message ${message.id}`);
  }

  replyToMessage(message: ChatMessage): void {
    // Logic để trả lời tin nhắn
    console.log(`Replied to message ${message.id}`);
    this.selectedReplyMessage = message;


  }
  clearReply(){
    this.selectedReplyMessage = undefined;
  }

  scrollToMessage(messageId: number): void {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    else{
      this.chatService.getMessageFromReply(messageId).subscribe(
        (res) =>{ this.messages = res}
      )
    }
  }
  triggerFileInput(){
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event:any){
    const fileInput = this.fileInput.nativeElement as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const uploadData = new FormData();
      uploadData.append('image', file, file.name);

      this.fileUploadService.uploadFile(uploadData).pipe(
        map((result: any) => {
          // Xử lý kết quả trả về từ máy chủ
          console.log('File uploaded successfully:', result.data.filename);
          this.wsService.sendMessage(result.data.fileUrl,undefined,"IMAGE");

        }),
        catchError((error) => {
          console.error('Error uploading file:', error);
          throw error;
        })
      ).subscribe();
    }
  }
}

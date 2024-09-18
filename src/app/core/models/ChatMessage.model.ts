export interface ChatMessage {
  id: number;
  username: string;
  avatarUrl: string;
  timestamp: Date;
  text?: string;
  type: string;
  messageReplyTo?:{
    id:number,
    username:string,
    text:string
    type:string
  }
}

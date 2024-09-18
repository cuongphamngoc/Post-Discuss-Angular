import { Comment } from './Comment';
import { Tag } from './Tag';
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: {
    id: number;
    name:string;
    avatarUrl: string;
  }
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  comments: Comment[];
}

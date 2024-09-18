import { Article } from "./Article";

export interface PaginatedArticleResponseDTO{
  articles : Article[];
  totalArticles: number;
  currentPage: number;
}

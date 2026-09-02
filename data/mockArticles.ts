import { Article } from "@/types/content";
import articlesData from "@/data/articles.json";

export const INITIAL_ARTICLES: Article[] = articlesData as unknown as Article[];

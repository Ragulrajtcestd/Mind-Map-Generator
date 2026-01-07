export interface Keyword {
  text: string;
  level: number;
  children?: Keyword[];
}

export interface MindMapData {
  id?: string;
  title: string;
  sourceText: string;
  keywords: Keyword[];
  language: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateRequest {
  text: string;
  language?: string;
}

export interface GenerateResponse {
  title: string;
  keywords: Keyword[];
}

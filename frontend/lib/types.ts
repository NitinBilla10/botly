export interface User {
  id: number;
  email: string;
  openaiApiKey: string;
}

export interface Chatbot {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  totalQuestions: number;
  status: 'active' | 'inactive';
  description?: string;
  instructions?: string;
}

export interface Analytics {
  question: string;
  answer: string;
  timestamp: string;
}

export interface CreateChatbotRequest {
  userId: number;
  chatbotName: string;
  description?: string;
  instructions?: string;
}

export interface UploadDataRequest {
  userId: number;
  chatbotId: number;
  file?: File;
  website?: string;
}

export interface QueryRequest {
  userId: number;
  chatbotId: number;
  question: string;
}

export interface RegisterUserRequest {
  email: string;
  openaiApiKey: string;
}
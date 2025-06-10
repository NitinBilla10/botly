// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface User {
  id: number;
  email: string;
  openai_api_key: string;
}

export interface Chatbot {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  user_id: number;
  is_public: boolean;
  has_data: boolean;
  data_source?: string;
  data_type?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updated_at?: string;
  last_trained?: string;
}

export interface Analytics {
  question: string;
  answer: string;
  timestamp: string;
}

export interface CreateChatbotRequest {
  name: string;
  description?: string;
  instructions?: string;
}

export interface QueryRequest {
  user_id: number;
  chatbot_id: number;
  question: string;
}

export interface UploadRequest {
  user_id: number;
  chatbot_id: number;
  file?: File;
  website?: string;
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Add auth token if available
    const token = getAuthToken();
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`API Error: ${response.status} - ${errorText}`) as any;
      error.response = { status: response.status };
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  private createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  }

  // User Management
  async registerUser(email: string, openaiApiKey: string): Promise<{ message: string; user_id: number }> {
    const formData = this.createFormData({
      email,
      openai_api_key: openaiApiKey
    });

    return this.request('/register', {
      method: 'POST',
      body: formData,
    });
  }

  // New Auth Methods
  async registerWithPassword(email: string, password: string, openaiApiKey: string): Promise<User> {
    return this.request('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        openai_api_key: openaiApiKey
      }),
    });
  }

  async loginWithPassword(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  async updateCurrentUser(data: { openai_api_key?: string }): Promise<User> {
    return this.request('/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // Chatbot Management - Updated to use new endpoints
  async createChatbot(data: CreateChatbotRequest): Promise<Chatbot> {
    return this.request('/chatbots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getChatbot(chatbotId: number): Promise<Chatbot> {
    return this.request(`/chatbot/${chatbotId}`);
  }

  async getChatbots(): Promise<Chatbot[]> {
    return this.request('/chatbots');
  }

  async updateChatbot(chatbotId: number, data: Partial<CreateChatbotRequest>): Promise<Chatbot> {
    return this.request(`/chatbots/${chatbotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteChatbot(chatbotId: number): Promise<{ message: string }> {
    return this.request(`/chatbot/${chatbotId}`, {
      method: 'DELETE',
    });
  }

  // Legacy methods for backward compatibility
  async createChatbotLegacy(userId: number, chatbotName: string): Promise<{ chatbot_id: number; message: string }> {
    const formData = this.createFormData({
      user_id: userId,
      chatbot_name: chatbotName
    });

    return this.request('/create_chatbot', {
      method: 'POST',
      body: formData,
    });
  }

  async getChatbotsLegacy(userId: number): Promise<Chatbot[]> {
    return this.request(`/chatbots/${userId}`);
  }

  // Data Upload
  async uploadData(userId: number, chatbotId: number, file?: File | null, website?: string): Promise<{ message: string }> {
    const formData = this.createFormData({
      user_id: userId,
      chatbot_id: chatbotId,
      ...(file && { file }),
      ...(website && { website })
    });

    return this.request('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Query Chatbot
  async queryChatbot(userId: number, chatbotId: number, question: string): Promise<{ answer: string }> {
    const formData = this.createFormData({
      user_id: userId,
      chatbot_id: chatbotId,
      question
    });

    return this.request('/query', {
      method: 'POST',
      body: formData,
    });
  }

  // Analytics
  async getAnalytics(userId: number, chatbotId: number): Promise<Analytics[]> {
    return this.request(`/analytics?user_id=${userId}&chatbot_id=${chatbotId}`);
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

// Export individual functions for easier use
export const registerUser = (email: string, openaiApiKey: string) => 
  apiClient.registerUser(email, openaiApiKey);

export const registerWithPassword = (email: string, password: string, openaiApiKey: string) => 
  apiClient.registerWithPassword(email, password, openaiApiKey);

export const loginWithPassword = (email: string, password: string) => 
  apiClient.loginWithPassword(email, password);

export const getCurrentUser = () => 
  apiClient.getCurrentUser();

export const updateCurrentUser = (data: { openai_api_key?: string }) => 
  apiClient.updateCurrentUser(data);

export const createChatbot = (data: CreateChatbotRequest) => 
  apiClient.createChatbot(data);

export const getChatbot = (chatbotId: number) => 
  apiClient.getChatbot(chatbotId);

export const getChatbots = () => 
  apiClient.getChatbots();

export const updateChatbot = (chatbotId: number, data: Partial<CreateChatbotRequest>) => 
  apiClient.updateChatbot(chatbotId, data);

export const deleteChatbot = (chatbotId: number) => 
  apiClient.deleteChatbot(chatbotId);

// Legacy exports
export const createChatbotLegacy = (userId: number, chatbotName: string) => 
  apiClient.createChatbotLegacy(userId, chatbotName);

export const getChatbotsLegacy = (userId: number) => 
  apiClient.getChatbotsLegacy(userId);

export const uploadData = (userId: number, chatbotId: number, file?: File | null, website?: string) => 
  apiClient.uploadData(userId, chatbotId, file, website);

export const queryChatbot = (userId: number, chatbotId: number, question: string) => 
  apiClient.queryChatbot(userId, chatbotId, question);

export const getAnalytics = (userId: number, chatbotId: number) => 
  apiClient.getAnalytics(userId, chatbotId);

export default apiClient;
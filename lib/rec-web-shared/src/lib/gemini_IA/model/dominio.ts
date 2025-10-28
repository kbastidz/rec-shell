interface GeminiRequest {
  prompt: string;
  //apiKey: string;
  //model?: 'gemini-pro' | 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-2.5-flash';
  temperature?: number;
  maxTokens?: number;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface UseGeminiOptions {
  temperature?: number;
  maxTokens?: number;
  onSuccess?: (response: string) => void;
  onError?: (error: string) => void;
}

interface UseGeminiReturn {
  response: string | null;
  loading: boolean;
  error: string | null;
  generateText: (prompt: string) => Promise<void>;
  reset: () => void;
}
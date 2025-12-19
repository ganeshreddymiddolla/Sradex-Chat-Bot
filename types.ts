
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

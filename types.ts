export interface VideoInsight {
  id: string;
  url: string;
  videoTitle: string;
  summary: string;
  highlights: string[];
  actionItems: ActionItem[];
  tags: string[];
  createdAt: number;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

// The raw structure returned by Gemini
export interface GeminiResponse {
  videoTitle: string;
  summary: string;
  highlights: string[];
  actionItems: string[]; // Gemini returns strings, we convert to ActionItem objects
  suggestedTags: string[];
}

export type ViewState = 'library' | 'analyze' | 'detail';

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
}